import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Heart, X } from 'lucide-react'

// Elementos que podem receber foco dentro do modal (para prender o Tab).
const FOCAVEIS = 'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'

export default function CartaModal({ carta, onClose }) {
  const painelRef = useRef(null)
  const fecharRef = useRef(null)

  // Leva o foco para dentro do modal ao abrir e devolve para a cartinha ao fechar.
  useEffect(() => {
    const anterior = document.activeElement
    fecharRef.current?.focus()
    return () => anterior?.focus?.()
  }, [])

  // Trava o scroll do fundo enquanto o modal está aberto.
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  // Esc fecha; Tab fica preso em ciclo dentro do painel.
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const focaveis = painelRef.current?.querySelectorAll(FOCAVEIS)
      if (!focaveis?.length) return

      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]

      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primeiro.focus()
      }
    }

    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      // Fecha ao clicar no fundo. O onMouseDown com currentTarget evita fechar
      // quando o clique começa dentro do painel e termina no fundo (arrastar).
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-rosa-deep/25 p-6 backdrop-blur-sm"
    >
      <motion.div
        ref={painelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="carta-titulo"
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 14 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative max-h-[80dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-gradient-to-br from-white via-rosa-bg to-rosa-soft p-8 text-center shadow-2xl shadow-rosa-mid/40 ring-1 ring-white/70"
      >
        <button
          ref={fecharRef}
          onClick={onClose}
          aria-label="Fechar a cartinha"
          className="absolute right-4 top-4 rounded-full bg-white/75 p-1.5 text-rosa-deep shadow transition hover:bg-white"
        >
          <X size={18} />
        </button>

        <Heart
          size={26}
          fill="currentColor"
          strokeWidth={1}
          className="mx-auto mb-3 text-rosa-mid/70"
        />

        <h4 id="carta-titulo" className="text-gradient font-serif text-2xl font-bold">
          Dia {carta.dia}
        </h4>

        <p className="mt-4 whitespace-pre-line font-hand text-2xl leading-snug text-rosa-deep/90">
          {carta.texto}
        </p>
      </motion.div>
    </motion.div>
  )
}
