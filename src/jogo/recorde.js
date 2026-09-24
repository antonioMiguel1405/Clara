// Recorde salvo no aparelho. Se o localStorage falhar (aba anônima,
// dados bloqueados), o jogo segue normal e o recorde vale só na sessão.
const CHAVE_MIMOS = 'clara-dodger-recorde-mimos'
const CHAVE_TEMPO = 'clara-dodger-melhor-tempo'

function ler(chave) {
  try {
    const v = Number(window.localStorage.getItem(chave))
    return Number.isFinite(v) && v > 0 ? v : 0
  } catch {
    return 0
  }
}

function gravar(chave, valor) {
  try {
    window.localStorage.setItem(chave, String(valor))
  } catch {
    // sem storage: fica só na memória
  }
}

// { mimos, tempo } — tempo = melhor tempo para completar (0 se nunca venceu)
export function lerRecorde() {
  return { mimos: ler(CHAVE_MIMOS), tempo: ler(CHAVE_TEMPO) }
}

export function salvarRecorde({ mimos, tempo }) {
  gravar(CHAVE_MIMOS, mimos)
  if (tempo) gravar(CHAVE_TEMPO, tempo)
}

export function formatarTempo(segundos) {
  const total = Math.round(segundos)
  const m = Math.floor(total / 60)
  const s = String(total % 60).padStart(2, '0')
  return `${m}:${s}`
}
