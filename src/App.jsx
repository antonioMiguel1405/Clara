import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import FloatingHearts from './components/FloatingHearts.jsx'
import IntroScreen from './components/IntroScreen.jsx'
import RevealScreen from './components/RevealScreen.jsx'

export default function App() {
  const [revealed, setRevealed] = useState(false)

  // Chuva de corações 💗
  const fireHeartConfetti = useCallback(() => {
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
  }, [])

  const handleReveal = useCallback(() => {
    fireHeartConfetti()
    setRevealed(true)
  }, [fireHeartConfetti])

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-rosa-bg via-white to-rosa-soft">
      {/* Brilho radial suave de fundo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 38%, rgba(255,182,206,0.30) 0%, rgba(255,240,245,0) 70%)',
        }}
      />

      <FloatingHearts />

      <AnimatePresence mode="wait">
        {revealed ? (
          <RevealScreen key="reveal" />
        ) : (
          <IntroScreen key="intro" onReveal={handleReveal} />
        )}
      </AnimatePresence>
    </main>
  )
}
