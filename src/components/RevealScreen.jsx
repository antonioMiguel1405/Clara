import { motion } from 'framer-motion'
import Divider from './Divider.jsx'
import PhotoGallery from './PhotoGallery.jsx'
import MusicPlayer from './MusicPlayer.jsx'
import SecaoDespedida from './SecaoDespedida.jsx'
import { reveal } from '../data/content.js'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.22, delayChildren: 0.3 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

export default function RevealScreen() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center gap-8 px-6 py-16 text-center"
    >
      <motion.div variants={item}>
        <Divider />
      </motion.div>

      <motion.h2
        variants={item}
        className="text-gradient max-w-xl whitespace-pre-line font-serif text-3xl font-bold leading-tight sm:text-4xl"
      >
        {reveal.title}
      </motion.h2>

      <motion.div variants={item} className="w-full">
        <PhotoGallery />
      </motion.div>

      <motion.div variants={item} className="max-w-md space-y-4">
        {reveal.paragraphs.map((p, i) => (
          <p key={i} className="font-hand text-2xl leading-snug text-rosa-deep/90">
            {p}
          </p>
        ))}
      </motion.div>

      <motion.p
        variants={item}
        className="text-gradient font-serif text-2xl italic"
      >
        {reveal.signature}
      </motion.p>

      <motion.div variants={item} className="w-full">
        <SecaoDespedida />
      </motion.div>

      <motion.div variants={item} className="mb-16">
        <Divider />
      </motion.div>

      <MusicPlayer autoStart />
    </motion.section>
  )
}
