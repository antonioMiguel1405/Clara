import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fotos, FOTO_INTERVALO } from '../data/content.js'

export default function PhotoGallery() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = (dir) => {
    setDirection(dir)
    setIndex((i) => (i + dir + fotos.length) % fotos.length)
  }

  // Slideshow automático
  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1)
      setIndex((i) => (i + 1) % fotos.length)
    }, FOTO_INTERVALO)
    return () => clearInterval(id)
  }, [])

  const foto = fotos[index]

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 1.04 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 1.04 }),
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-rosa-soft shadow-xl shadow-rosa-mid/30 ring-4 ring-white/60">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.img
            key={index}
            src={foto.src}
            alt={foto.legenda}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </AnimatePresence>

        {/* Legenda */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-4">
          <p className="font-hand text-xl text-white drop-shadow">{foto.legenda}</p>
        </div>

        {/* Setas */}
        <button
          onClick={() => go(-1)}
          aria-label="Foto anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-1.5 text-rosa-deep shadow backdrop-blur transition hover:bg-white"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Próxima foto"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-1.5 text-rosa-deep shadow backdrop-blur transition hover:bg-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Indicadores */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {fotos.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1)
              setIndex(i)
            }}
            aria-label={`Ir para a foto ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-rosa-deep' : 'w-2 bg-rosa-mid/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
