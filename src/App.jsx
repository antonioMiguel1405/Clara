import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import FloatingHearts from './components/FloatingHearts.jsx'
import IntroScreen from './components/IntroScreen.jsx'
import RevealScreen from './components/RevealScreen.jsx'
import JogoDodger from './components/JogoDodger.jsx'
import TelaRecompensa from './components/TelaRecompensa.jsx'
import { chuvaDeCoracoes } from './chuvaDeCoracoes.js'

export default function App() {
  // 'intro' | 'reveal' | 'jogo' | 'recompensa'
  const [tela, setTela] = useState('intro')

  const handleReveal = useCallback(() => {
    chuvaDeCoracoes()
    setTela('reveal')
  }, [])

  const irParaIntro = useCallback(() => setTela('intro'), [])

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
        {tela === 'intro' && (
          <IntroScreen key="intro" onReveal={handleReveal} onJogar={() => setTela('jogo')} />
        )}
        {tela === 'reveal' && <RevealScreen key="reveal" />}
        {tela === 'jogo' && (
          <JogoDodger key="jogo" onInicio={irParaIntro} onVencer={() => setTela('recompensa')} />
        )}
        {tela === 'recompensa' && <TelaRecompensa key="recompensa" onInicio={irParaIntro} />}
      </AnimatePresence>
    </main>
  )
}
