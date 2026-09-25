import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clapperboard, Home } from 'lucide-react'
import Divider from './Divider.jsx'
import { botaoClaro } from './botoes.js'
import { fotosRecompensa, recompensa } from '../data/content.js'

const COLUNAS = 4

// Contorno branco em volta das letras: o texto fica legível em cima das
// fotos sem precisar borrar nem esconder o fundo
const CONTORNO_BRANCO =
  '0 0 2px #fff, 0 0 3px #fff, 0 0 6px #fff, 0 0 10px rgba(255,255,255,0.9), 0 0 16px rgba(255,255,255,0.8)'

// Pixel transparente no lugar de capa: com o fundo preto do player, antes
// do play fica tudo preto em qualquer navegador (sem isso, alguns mostram o 1º quadro)
const TELA_PRETA =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

// Cada coluna começa a lista numa foto diferente, então até no celular
// (só 2 colunas visíveis) todas as fotos acabam passando pela tela.
function fotosDaColuna(c) {
  const n = fotosRecompensa.length
  const inicio = Math.round((c * n) / COLUNAS)
  return [...fotosRecompensa.slice(inicio), ...fotosRecompensa.slice(0, inicio)]
}

// Mosaico de fundo: colunas de fotos subindo/descendo devagar, em loop.
// A lista é duplicada para o loop de -50% emendar sem salto.
function MosaicoFundo() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="flex h-full gap-3 px-3">
        {Array.from({ length: COLUNAS }, (_, c) => {
          const fotos = fotosDaColuna(c)
          const visivel = c < 2 ? 'flex' : c === 2 ? 'hidden sm:flex' : 'hidden lg:flex'
          return (
            <div key={c} className={`${visivel} min-w-0 flex-1 flex-col`}>
              <div
                className="mosaico-coluna flex flex-col gap-3"
                style={{
                  animationDuration: `${70 + c * 12}s`,
                  animationDirection: c % 2 ? 'reverse' : 'normal',
                }}
              >
                {[...fotos, ...fotos].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-full rounded-2xl object-cover shadow-md shadow-rosa-mid/20"
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {/* véu rosado para o texto ficar legível por cima das fotos */}
      <div className="absolute inset-0 bg-gradient-to-b from-rosa-bg/35 via-rosa-bg/20 to-rosa-bg/40" />
    </div>
  )
}

// Página que abre depois de vencer o jogo: vídeo + mensagem
export default function TelaRecompensa({ onInicio }) {
  // Começa do topo (a tela anterior pode ter deixado a página rolada)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="relative z-10 min-h-[100dvh] w-full"
    >
      <MosaicoFundo />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex min-h-[100dvh] w-full items-center justify-center px-4 py-10"
      >
        {/* translúcido e sem desfoque: as fotos do fundo aparecem nítidas por trás */}
        <div className="flex w-full max-w-xl flex-col items-center gap-6 rounded-[32px] bg-white/35 px-5 py-8 text-center shadow-2xl shadow-rosa-mid/40 ring-1 ring-white/80 sm:px-8">
          <motion.div variants={item}>
            <Divider />
          </motion.div>

          <motion.h2
            variants={item}
            className="text-gradient font-serif text-3xl font-bold leading-tight drop-shadow-[0_0_3px_#fff] sm:text-4xl"
          >
            {recompensa.titulo}
          </motion.h2>

          <motion.div variants={item} className="w-full">
            {recompensa.video ? (
              // Caixa com a proporção do vídeo, limitada à largura do cartão e a
              // 70% da altura da tela — não muda de tamanho quando começa a tocar
              <div
                className="mx-auto overflow-hidden rounded-2xl bg-black shadow-lg shadow-rosa-mid/30"
                style={{
                  aspectRatio: `${recompensa.videoLargura} / ${recompensa.videoAltura}`,
                  width: `min(100%, calc(70dvh * ${recompensa.videoLargura} / ${recompensa.videoAltura}))`,
                }}
              >
                <video
                  src={recompensa.video}
                  poster={TELA_PRETA}
                  controls
                  playsInline
                  preload="metadata"
                  className="block h-full w-full bg-black object-contain"
                />
              </div>
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl bg-rosa-soft/80 text-rosa-deep ring-1 ring-rosa-mid/30">
                <Clapperboard size={36} strokeWidth={1.5} />
                <p className="font-hand text-xl">{recompensa.videoEmBreve}</p>
              </div>
            )}
          </motion.div>

          <motion.p
            variants={item}
            className="max-w-md whitespace-pre-line font-hand text-xl font-bold leading-snug text-[#D6246E] sm:text-2xl"
            style={{ textShadow: CONTORNO_BRANCO }}
          >
            {recompensa.mensagem}
          </motion.p>

          <motion.button variants={item} onClick={onInicio} className={botaoClaro}>
            <Home size={18} />
            {recompensa.voltar}
          </motion.button>

          <motion.div variants={item}>
            <Divider />
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}
