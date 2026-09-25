import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clapperboard, Home } from 'lucide-react'
import Divider from './Divider.jsx'
import { botaoClaro } from './botoes.js'
import { fotosRecompensa, recompensa } from '../data/content.js'

const COLUNAS = 4

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
      <div className="absolute inset-0 bg-gradient-to-b from-rosa-bg/55 via-rosa-bg/35 to-rosa-bg/60" />
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
        <div className="flex w-full max-w-xl flex-col items-center gap-6 rounded-[32px] bg-white/85 px-5 py-8 text-center shadow-2xl shadow-rosa-mid/40 ring-1 ring-white backdrop-blur-md sm:px-8">
          <motion.div variants={item}>
            <Divider />
          </motion.div>

          <motion.h2
            variants={item}
            className="text-gradient font-serif text-3xl font-bold leading-tight sm:text-4xl"
          >
            {recompensa.titulo}
          </motion.h2>

          <motion.div variants={item} className="w-full">
            {recompensa.video ? (
              // Tamanho segue a proporção do próprio vídeo (vertical ou horizontal),
              // sem faixas pretas, limitado à altura da tela
              <video
                src={recompensa.video}
                poster={recompensa.capa || undefined}
                controls
                playsInline
                preload="metadata"
                className="mx-auto block h-auto max-h-[70dvh] w-auto max-w-full rounded-2xl bg-black shadow-lg shadow-rosa-mid/30"
              />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl bg-rosa-soft/80 text-rosa-deep ring-1 ring-rosa-mid/30">
                <Clapperboard size={36} strokeWidth={1.5} />
                <p className="font-hand text-xl">{recompensa.videoEmBreve}</p>
              </div>
            )}
          </motion.div>

          <motion.p
            variants={item}
            className="max-w-md whitespace-pre-line font-hand text-xl leading-snug text-rosa-deep/90 sm:text-2xl"
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
