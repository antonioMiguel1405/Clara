import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import Divider from './Divider.jsx'
import { botaoClaro } from './botoes.js'
import { jogo } from '../data/content.js'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.22, delayChildren: 0.2 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

// Mensagem que abre quando a Clara pega os 36 mimos
export default function TelaFinal({ onInicio }) {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center gap-8 px-6 py-16 text-center"
    >
      <motion.div variants={item}>
        <Divider />
      </motion.div>

      <motion.h2
        variants={item}
        className="text-gradient max-w-xl whitespace-pre-line font-serif text-3xl font-bold leading-tight sm:text-4xl"
      >
        {jogo.final.titulo}
      </motion.h2>

      <motion.p
        variants={item}
        className="max-w-md whitespace-pre-line font-hand text-2xl leading-snug text-rosa-deep/90"
      >
        {jogo.final.texto}
      </motion.p>

      <motion.button variants={item} onClick={onInicio} className={botaoClaro}>
        <Home size={18} />
        {jogo.final.voltar}
      </motion.button>

      <motion.div variants={item}>
        <Divider />
      </motion.div>
    </motion.section>
  )
}
