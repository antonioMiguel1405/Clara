import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { contadorNamoro, DATA_INICIO_NAMORO } from '../data/content.js'

const SEGUNDO_MS = 1000
const MINUTO_MS = 60 * SEGUNDO_MS
const HORA_MS = 60 * MINUTO_MS
const DIA_MS = 24 * HORA_MS
const FUSO_BRASILIA_MS = -3 * HORA_MS

const inicio = new Date(DATA_INICIO_NAMORO)
const inicioMs = inicio.getTime()

// Meses + dias de calendário, contados no fuso de Brasília (e não no do
// celular de quem abre o site): desloca -3h e lê tudo com os getters UTC.
function mesesEDias(agoraMs) {
  const de = new Date(inicioMs + FUSO_BRASILIA_MS)
  const ate = new Date(agoraMs + FUSO_BRASILIA_MS)

  let meses =
    (ate.getUTCFullYear() - de.getUTCFullYear()) * 12 + (ate.getUTCMonth() - de.getUTCMonth())
  if (ate.getUTCDate() < de.getUTCDate()) meses -= 1

  const aniversarioMes = Date.UTC(de.getUTCFullYear(), de.getUTCMonth() + meses, de.getUTCDate())
  const dias = Math.floor((ate.getTime() - aniversarioMes) / DIA_MS)
  return { meses: Math.max(0, meses), dias: Math.max(0, dias) }
}

function plural(n, singular, pluralTxt) {
  return `${n} ${n === 1 ? singular : pluralTxt}`
}

export default function ContadorNamoro() {
  const [agora, setAgora] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const decorrido = Math.max(0, agora - inicioMs)
  const totalDias = Math.floor(decorrido / DIA_MS)
  const relogio = [
    Math.floor(decorrido / HORA_MS) % 24,
    Math.floor(decorrido / MINUTO_MS) % 60,
    Math.floor(decorrido / SEGUNDO_MS) % 60,
  ]
    .map((n) => String(n).padStart(2, '0'))
    .join(':')
  const { meses, dias } = mesesEDias(agora)

  return (
    <div className="relative flex flex-col items-center gap-2 rounded-[2rem] bg-white/70 px-10 py-6 shadow-lg shadow-rosa-mid/20 ring-1 ring-rosa-soft backdrop-blur">
      {/* Coraçõezinhos nos cantos do cartão */}
      <Heart
        size={18}
        fill="currentColor"
        strokeWidth={1}
        className="absolute -left-2 -top-2 rotate-[-18deg] text-rosa-mid/80"
      />
      <Heart
        size={22}
        fill="currentColor"
        strokeWidth={1}
        className="absolute -bottom-2 -right-2 rotate-[14deg] animate-heartbeat text-rosa-deep/80"
      />

      <p className="font-hand text-2xl leading-none text-rosa-deep/90">{contadorNamoro.acima}</p>

      {/* aria-live="off": o relógio muda a cada segundo; o total já vai no aria-label. */}
      <div
        aria-live="off"
        aria-label={`${plural(totalDias, 'dia', 'dias')} juntos`}
        className="flex items-baseline gap-2"
      >
        <span className="text-gradient font-serif text-6xl font-black tabular-nums sm:text-7xl">
          {totalDias}
        </span>
        <span className="font-hand text-3xl text-rosa-mid">{totalDias === 1 ? 'dia' : 'dias'}</span>
      </div>

      <p className="font-serif text-sm italic text-rosa-mid">
        {meses > 0 && `${plural(meses, 'mês', 'meses')} e `}
        {plural(dias, 'dia', 'dias')} · <span className="tabular-nums">{relogio}</span>
      </p>

      <p className="font-hand text-xl leading-none text-rosa-deep/80">{contadorNamoro.abaixo}</p>
      <p className="font-hand text-base leading-none text-rosa-mid/70">{contadorNamoro.desde}</p>
    </div>
  )
}
