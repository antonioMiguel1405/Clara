import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fotos, FOTO_INTERVALO } from '../data/content.js'

export default function PhotoGallery() {
  const [index, setIndex] = useState(0)

  const go = (dir) => setIndex((i) => (i + dir + fotos.length) % fotos.length)

  // Slideshow automático
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % fotos.length)
    }, FOTO_INTERVALO)
    return () => clearInterval(id)
  }, [])

  const foto = fotos[index]

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/*
        PALCO de altura fixa: reserva sempre o mesmo espaço vertical, então
        a troca de fotos (retrato/paisagem) NUNCA empurra o resto da página.
        A foto é centralizada aqui dentro.
      */}
      <div className="relative flex h-[58vh] max-h-[560px] min-h-[260px] w-full items-center justify-center px-10">
        {/* Seta anterior — presa às bordas do palco (layout estável) */}
        <button
          onClick={() => go(-1)}
          aria-label="Foto anterior"
          className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/75 p-1.5 text-rosa-deep shadow backdrop-blur transition hover:bg-white"
        >
          <ChevronLeft size={22} />
        </button>

        <AnimatePresence mode="wait">
          {/*
            A MOLDURA abraça a imagem real: inline-flex faz a figure encolher
            até o tamanho da foto. max-h/max-w mantêm tudo dentro do palco.
          */}
          <motion.figure
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            className="relative m-0 inline-flex max-h-full max-w-full"
          >
            <img
              src={foto.src}
              alt={foto.legenda}
              loading="lazy"
              // object-contain => foto inteira, sem corte e sem distorção.
              // w-auto/h-auto + max-* => encolhe/expande conforme a orientação,
              // sempre respeitando os limites do palco e da viewport.
              className="block h-auto max-h-[58vh] w-auto max-w-full rounded-3xl object-contain shadow-xl shadow-rosa-mid/30 ring-4 ring-white/60 sm:max-h-[560px]"
            />

            {/* Legenda colada na imagem (acompanha o tamanho real dela) */}
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-3xl bg-gradient-to-t from-black/55 via-black/15 to-transparent p-4 text-center">
              <span className="font-hand text-xl text-white drop-shadow sm:text-2xl">
                {foto.legenda}
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        {/* Seta próxima */}
        <button
          onClick={() => go(1)}
          aria-label="Próxima foto"
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/75 p-1.5 text-rosa-deep shadow backdrop-blur transition hover:bg-white"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Indicadores */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {fotos.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
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
