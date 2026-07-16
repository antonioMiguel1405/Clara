import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock, Mail } from 'lucide-react'
import CartaModal from './CartaModal.jsx'
import { cartas, despedida, DATA_PARTIDA } from '../data/content.js'

const DIA_MS = 24 * 60 * 60 * 1000
const partidaMs = new Date(DATA_PARTIDA).getTime()

// ============================================================
//  REGRA DE DESBLOQUEIO — fonte única da verdade
//  A carta do Dia N abre em DATA_PARTIDA + (N-1) x 24h.
//  NÃO é à meia-noite local, e isso é de propósito:
//   - o Dia 1 já nasce aberto no instante da partida;
//   - a conta é imune a fuso horário e a horário de verão;
//   - bate exatamente com o texto "Disponível em X dias".
//  (a SecaoDespedida importa esta função em vez de repetir a regra)
// ============================================================
export function msDesbloqueio(dia) {
  return partidaMs + (dia - 1) * DIA_MS
}

// Coerente com a regra das 24h: a PRÓXIMA carta a abrir sempre tem no máximo
// 24h restantes -> mensagem carinhosa. As seguintes caem em (24h, 48h],
// (48h, 72h]... -> o Math.ceil devolve 2, 3, ... e o plural "dias" nunca erra.
function textoBloqueio(restanteMs) {
  if (restanteMs <= DIA_MS) return despedida.cartaEmBreve
  return `Disponível em ${Math.ceil(restanteMs / DIA_MS)} dias`
}

export default function CartasDiarias({ agora }) {
  const [aberta, setAberta] = useState(null)

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h4 className="text-gradient font-serif text-2xl font-bold sm:text-3xl">
        {despedida.cartasTitulo}
      </h4>

      <ul className="flex w-full max-w-2xl list-none flex-wrap justify-center gap-3 p-0 sm:gap-4">
        {cartas.map((carta) => {
          const restante = msDesbloqueio(carta.dia) - agora
          const liberada = restante <= 0

          return (
            <li key={carta.dia} className="w-[45%] sm:w-36">
              <motion.button
                type="button"
                disabled={!liberada}
                onClick={() => liberada && setAberta(carta)}
                // Só a carta liberada reage ao toque — a bloqueada nem é clicável.
                whileHover={liberada ? { scale: 1.04 } : undefined}
                whileTap={liberada ? { scale: 0.96 } : undefined}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                aria-label={
                  liberada
                    ? `Abrir a cartinha do Dia ${carta.dia}`
                    : `Cartinha do Dia ${carta.dia} bloqueada. ${textoBloqueio(restante)}`
                }
                className={`flex h-full w-full flex-col items-center gap-1.5 rounded-3xl px-3 py-5 text-center shadow-lg ring-1 backdrop-blur transition-colors ${
                  liberada
                    ? 'cursor-pointer bg-white/75 shadow-rosa-mid/25 ring-rosa-soft hover:bg-white'
                    : 'cursor-not-allowed bg-white/40 shadow-rosa-mid/10 ring-rosa-soft/60'
                }`}
              >
                {liberada ? (
                  <Mail size={22} className="animate-floaty text-rosa-deep" />
                ) : (
                  <Lock size={22} className="text-rosa-mid/50" />
                )}

                <span
                  className={`font-serif text-lg font-bold ${
                    liberada ? 'text-gradient' : 'text-rosa-mid/60'
                  }`}
                >
                  Dia {carta.dia}
                </span>

                <span
                  className={`font-hand text-lg leading-tight ${
                    liberada ? 'text-rosa-deep/80' : 'text-rosa-mid/60'
                  }`}
                >
                  {liberada ? despedida.cartaAberta : textoBloqueio(restante)}
                </span>
              </motion.button>
            </li>
          )
        })}
      </ul>

      <AnimatePresence>
        {aberta && <CartaModal carta={aberta} onClose={() => setAberta(null)} />}
      </AnimatePresence>
    </div>
  )
}
