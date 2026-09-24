import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { fotoSurpresa } from '../data/content.js'

const DOBRA = { duration: 0.75, ease: [0.45, 0, 0.2, 1] }

// Papel do lado de fora da carta: linhas de caderno bem clarinhas.
const papel = {
  backgroundColor: '#fffafc',
  backgroundImage:
    'repeating-linear-gradient(0deg, rgba(255,143,177,0.16) 0px, rgba(255,143,177,0.16) 1px, transparent 1px, transparent 22px)',
}

// Um terço da carta. O <img> tem 300% da altura do painel e é deslocado
// para mostrar só a sua faixa — juntando as 3 faixas, a foto fica inteira.
function FaixaDaFoto({ src, faixa, className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-white [backface-visibility:hidden] ${className}`}>
      <img
        src={src}
        alt=""
        draggable={false}
        className="absolute left-0 h-[300%] w-full object-cover"
        style={{ top: `${-100 * faixa}%` }}
      />
    </div>
  )
}

function Verso({ className = '', children }) {
  return (
    <div
      className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)] ${className}`}
      style={papel}
    >
      {children}
    </div>
  )
}

/*
  Carta dobrada em 3, vista de frente:
    - o painel do meio fica parado;
    - o de baixo vem dobrado para cima (rotateX 180°, eixo na borda de cima dele);
    - o de cima vem dobrado para baixo por cima de tudo (rotateX -180°, eixo na borda de baixo).
  Abre primeiro o de cima, depois o de baixo. O `z` separa as camadas
  dobradas para o navegador não misturar os painéis enquanto giram.
*/
export default function FolhaFoto({ src, animar, onAberta }) {
  // Proporção real da foto: a carta nasce com o formato dela, então nada é cortado.
  const [proporcao, setProporcao] = useState(null)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    let ativo = true
    const img = new Image()
    img.onload = () => ativo && setProporcao(img.naturalWidth / img.naturalHeight)
    img.onerror = () => {
      if (!ativo) return
      setErro(true)
      onAberta?.()
    }
    img.src = src
    return () => {
      ativo = false
    }
    // onAberta muda a cada render do pai; a foto só precisa carregar uma vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  useEffect(() => {
    if (proporcao && !animar) onAberta?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proporcao, animar])

  if (erro) {
    return <p className="font-hand text-2xl text-rosa-deep/90">Essa foto não quis abrir 🥺</p>
  }

  if (!proporcao) {
    return (
      <Heart
        size={44}
        fill="#FF6FA0"
        strokeWidth={1.5}
        className="animate-heartbeat text-rosa-deep"
        aria-label="Carregando foto"
      />
    )
  }

  const inicial = animar ? 'dobrada' : false

  return (
    <motion.div
      initial={animar ? { opacity: 0, scale: 0.85, rotate: -4, y: 20 } : { opacity: 0 }}
      animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
      transition={{ duration: animar ? 0.55 : 0.3, ease: 'easeOut' }}
      className="[perspective:1400px]"
    >
      <div
        role="img"
        aria-label="Uma foto nossa"
        className="relative [transform-style:preserve-3d]"
        style={{
          aspectRatio: proporcao,
          width: `min(86vw, 26rem, calc(60dvh * ${proporcao}))`,
        }}
      >
        {/* Sombra: cresce junto com a carta (sombra nos painéis vazaria por cima dos vizinhos) */}
        <motion.div
          initial={animar ? { top: '33.33%', bottom: '33.33%' } : false}
          animate={{ top: '0%', bottom: '0%' }}
          transition={{
            top: { ...DOBRA, delay: animar ? 0.75 : 0 },
            bottom: { ...DOBRA, delay: animar ? 1.35 : 0 },
          }}
          className="absolute inset-x-0 rounded-xl bg-white shadow-2xl shadow-rosa-deep/30"
        />

        {/* Meio: fixo */}
        <div className="absolute inset-x-0 top-1/3 h-1/3">
          <FaixaDaFoto src={src} faixa={1} />
        </div>

        {/* Baixo: vem dobrado para cima */}
        <motion.div
          variants={{ dobrada: { rotateX: 180, z: 1 }, aberta: { rotateX: 0, z: 0 } }}
          initial={inicial}
          animate="aberta"
          transition={{ ...DOBRA, delay: animar ? 1.35 : 0 }}
          onAnimationComplete={() => animar && onAberta?.()}
          className="absolute inset-x-0 top-2/3 h-1/3 origin-top [transform-style:preserve-3d]"
        >
          <FaixaDaFoto src={src} faixa={2} className="rounded-b-xl" />
          <Verso className="rounded-t-xl" />
        </motion.div>

        {/* Cima: vem dobrado para baixo, por cima de tudo — é o "envelope" que ela vê */}
        <motion.div
          variants={{ dobrada: { rotateX: -180, z: 2 }, aberta: { rotateX: 0, z: 0 } }}
          initial={inicial}
          animate="aberta"
          transition={{ ...DOBRA, delay: animar ? 0.75 : 0 }}
          className="absolute inset-x-0 top-0 h-1/3 origin-bottom [transform-style:preserve-3d]"
        >
          <FaixaDaFoto src={src} faixa={0} className="rounded-t-xl" />
          <Verso className="flex flex-col items-center justify-center gap-0.5 rounded-b-xl ring-1 ring-rosa-soft">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rosa-deep shadow-md shadow-rosa-deep/40">
              <Heart size={15} fill="white" strokeWidth={0} />
            </span>
            <span className="font-hand text-lg leading-none text-rosa-deep/90">{fotoSurpresa.verso}</span>
          </Verso>
        </motion.div>

        {/* Marquinhas das dobras, que ficam no papel depois de aberto */}
        <div className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-black/10" />
        <div className="pointer-events-none absolute inset-x-0 top-2/3 h-px bg-black/10" />
      </div>
    </motion.div>
  )
}
