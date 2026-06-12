import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Divider from './Divider.jsx'
import { intro } from '../data/content.js'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function IntroScreen({ onReveal }) {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.7, ease: 'easeInOut' } }}
      className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center gap-7 px-6 py-12 text-center"
    >
      <motion.div variants={item}>
        <Divider />
      </motion.div>

      <motion.p
        variants={item}
        className="max-w-md font-hand text-2xl leading-snug text-rosa-deep/90 sm:text-3xl"
      >
        {intro.eyebrow}
      </motion.p>

      <motion.h1
        variants={item}
        className="text-gradient font-serif text-6xl font-black tracking-tight sm:text-7xl"
      >
        {intro.word}
      </motion.h1>

      <motion.p
        variants={item}
        className="max-w-md whitespace-pre-line font-serif text-base italic leading-relaxed text-rosa-mid sm:text-lg"
      >
        {intro.subtitle}
      </motion.p>

      <motion.button
        variants={item}
        onClick={onReveal}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Abrir a declaração"
        className="group relative mt-2 flex h-28 w-28 items-center justify-center rounded-full bg-white/90 shadow-lg shadow-rosa-mid/30 backdrop-blur-sm animate-glow focus:outline-none focus-visible:ring-4 focus-visible:ring-rosa-mid/40"
      >
        <Heart
          size={52}
          className="animate-heartbeat text-rosa-deep drop-shadow-[0_2px_8px_rgba(255,78,139,0.45)] transition-transform"
          fill="#FF6FA0"
          strokeWidth={1.5}
        />
      </motion.button>

      <motion.div variants={item} className="space-y-1">
        <p className="font-hand text-xl text-rosa-mid">{intro.cta}</p>
        <p className="font-hand text-base text-rosa-mid/70">{intro.hint}</p>
      </motion.div>

      <motion.div variants={item} className="mt-2">
        <Divider />
      </motion.div>
    </motion.section>
  )
}
