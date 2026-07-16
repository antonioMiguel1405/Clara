import { AnimatePresence, motion } from 'framer-motion'
import { despedida, DATA_RETORNO } from '../data/content.js'

const SEGUNDO_MS = 1000
const MINUTO_MS = 60 * SEGUNDO_MS
const HORA_MS = 60 * MINUTO_MS
const DIA_MS = 24 * HORA_MS

const retornoMs = new Date(DATA_RETORNO).getTime()

// Quebra o tempo que falta em dias/horas/minutos/segundos.
// O Math.max(0, ...) garante que nunca aparece número negativo.
function partes(restanteMs) {
  const total = Math.max(0, restanteMs)
  return [
    { valor: Math.floor(total / DIA_MS), rotulo: 'dias' },
    { valor: Math.floor(total / HORA_MS) % 24, rotulo: 'horas' },
    { valor: Math.floor(total / MINUTO_MS) % 60, rotulo: 'min' },
    { valor: Math.floor(total / SEGUNDO_MS) % 60, rotulo: 'seg' },
  ]
}

export default function Countdown({ agora }) {
  const restante = retornoMs - agora
  const chegou = restante <= 0

  return (
    <AnimatePresence mode="wait">
      {chegou ? (
        <motion.p
          key="fim"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-gradient max-w-md animate-heartbeat font-serif text-2xl font-bold leading-snug sm:text-3xl"
        >
          {despedida.contadorFim}
        </motion.p>
      ) : (
        <motion.div
          key="contando"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center gap-3"
        >
          <p className="font-hand text-2xl text-rosa-deep/90">{despedida.contadorAcima}</p>

          {/* aria-live="off": um leitor de tela anunciando a cada segundo seria
              insuportável. O tempo restante já vai no aria-label do bloco. */}
          <div
            aria-live="off"
            aria-label={partes(restante)
              .map((p) => `${p.valor} ${p.rotulo}`)
              .join(', ')}
            className="flex items-start justify-center gap-2 sm:gap-3"
          >
            {partes(restante).map(({ valor, rotulo }) => (
              <div
                key={rotulo}
                /* Largura FIXA + tabular-nums: o layout não pode "pular" a cada
                   segundo. A largura fixa é o que realmente garante isso, porque
                   a Playfair não tem números tabulares em todo navegador. */
                className="flex w-[4.25rem] flex-col items-center rounded-2xl bg-white/70 py-3 shadow-lg shadow-rosa-mid/20 ring-1 ring-rosa-soft backdrop-blur sm:w-20"
              >
                <span className="text-gradient font-serif text-3xl font-bold tabular-nums sm:text-4xl">
                  {String(valor).padStart(2, '0')}
                </span>
                <span className="font-hand text-lg leading-none text-rosa-mid">{rotulo}</span>
              </div>
            ))}
          </div>

          <p className="max-w-xs font-hand text-2xl text-rosa-deep/90">{despedida.contadorAbaixo}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
