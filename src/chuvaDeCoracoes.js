import confetti from 'canvas-confetti'

// Chuva de corações 💗 (usada ao abrir a declaração e ao vencer o jogo)
export function chuvaDeCoracoes() {
  let heart
  try {
    heart = confetti.shapeFromText({ text: '❤️', scalar: 2.4 })
  } catch {
    heart = undefined // fallback para confete padrão em navegadores antigos
  }

  const base = {
    spread: 360,
    ticks: 220,
    gravity: 0.5,
    decay: 0.94,
    startVelocity: 32,
    scalar: 2.2,
    shapes: heart ? [heart] : undefined,
    colors: heart ? undefined : ['#FF4E8B', '#FF8FB1', '#FFC8DD', '#A020C0'],
  }

  // Estouro central
  confetti({ ...base, particleCount: 60, origin: { x: 0.5, y: 0.5 } })
  // Reforços laterais
  setTimeout(
    () => confetti({ ...base, particleCount: 40, origin: { x: 0.15, y: 0.6 } }),
    150,
  )
  setTimeout(
    () => confetti({ ...base, particleCount: 40, origin: { x: 0.85, y: 0.6 } }),
    300,
  )
}
