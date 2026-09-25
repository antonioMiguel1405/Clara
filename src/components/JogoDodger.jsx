import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Gift, Heart, Home, Play, RotateCcw } from 'lucide-react'
import { botaoClaro, botaoForte } from './botoes.js'
import { jogo } from '../data/content.js'
import { Game } from '../jogo/Game.js'
import { ALTURA, ESTUDOS, LARGURA, META_MIMOS, MIMOS, VIDAS } from '../jogo/constantes.js'
import { DESENHAR_ESTUDO, DESENHAR_MIMO } from '../jogo/desenhos.js'
import { formatarTempo, lerRecorde, salvarRecorde } from '../jogo/recorde.js'
import { chuvaDeCoracoes } from '../chuvaDeCoracoes.js'

const botaoPequeno =
  'pointer-events-auto flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 font-hand text-lg text-rosa-deep shadow-md shadow-rosa-mid/20 ring-1 ring-rosa-soft backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-rosa-mid/40'

// Desenho estático de um mimo/estudo, usando as mesmas funções do jogo
function MiniDesenho({ tipo, mimo = false, tamanho = 40 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const dpr = window.devicePixelRatio || 1
    canvas.width = tamanho * dpr
    canvas.height = tamanho * dpr
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.translate(tamanho / 2, tamanho / 2)
    if (mimo) {
      const t = MIMOS[tipo].tamanho
      const e = (tamanho * 0.78) / t
      ctx.scale(e, e)
      DESENHAR_MIMO[tipo](ctx, { tamanho: t })
    } else {
      const b = ESTUDOS[tipo]
      const e = Math.min((tamanho * 0.8) / b.largura, (tamanho * 0.9) / b.altura)
      ctx.scale(e, e)
      DESENHAR_ESTUDO[tipo](ctx, { largura: b.largura, altura: b.altura, abertura: 0.6 })
    }
  }, [tipo, mimo, tamanho])

  return <canvas ref={ref} style={{ width: tamanho, height: tamanho }} aria-hidden="true" />
}

// `atraso` (s) deixa a cena aparecer antes do painel (ex.: na vitória)
function Painel({ children, atraso = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: atraso }}
      className="absolute inset-0 z-10 flex items-center justify-center overflow-y-auto bg-rosa-bg/60 px-4 pb-4 pt-16 backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: atraso }}
        className="flex w-full max-w-[330px] flex-col items-center gap-3 rounded-3xl bg-white/90 px-5 py-6 text-center shadow-xl shadow-rosa-mid/25 ring-1 ring-rosa-soft"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function JogoDodger({ onInicio, onVencer }) {
  const areaRef = useRef(null)
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const tamanhoRef = useRef(null)

  // 'inicio' | 'jogando' | 'pausado' | 'fim' | 'vitoria'
  const [fase, setFase] = useState('inicio')
  const [coletados, setColetados] = useState(0)
  const [vidas, setVidas] = useState(VIDAS)
  const [recorde, setRecorde] = useState(lerRecorde)
  const recordeRef = useRef(recorde)
  const [resultado, setResultado] = useState(null)
  const [tamanho, setTamanho] = useState(null)

  const toque = useMemo(() => window.matchMedia?.('(pointer: coarse)').matches ?? false, [])

  // Cria o motor do jogo; o React não re-renderiza por quadro,
  // só quando algum callback avisa.
  useEffect(() => {
    document.fonts?.load('700 24px Caveat').catch(() => {})

    const atualizarRecorde = (novo) => {
      recordeRef.current = novo
      salvarRecorde(novo)
      setRecorde(novo)
    }

    const textosCanvas = { quase: jogo.quase, perdeuVida: jogo.perdeuVida }
    const callbacks = {
      onColetar: (n) => setColetados(n),
      onVida: (n) => setVidas(n),
      onPausa: () => setFase('pausado'),
      onGameOver: ({ mimos }) => {
        const r = recordeRef.current
        const novoRecorde = mimos > r.mimos
        if (novoRecorde) atualizarRecorde({ ...r, mimos })
        setResultado({ mimos, novoRecorde })
        setFase('fim')
      },
      onVitoria: ({ tempo }) => {
        const r = recordeRef.current
        atualizarRecorde({
          mimos: Math.max(r.mimos, META_MIMOS),
          tempo: r.tempo ? Math.min(r.tempo, tempo) : tempo,
        })
        setFase('vitoria')
        chuvaDeCoracoes()
      },
    }
    const game = new Game(canvasRef.current, callbacks, textosCanvas)
    gameRef.current = game
    if (tamanhoRef.current) {
      const { w, h } = tamanhoRef.current
      game.redimensionar(w, h, window.devicePixelRatio || 1)
    }

    return () => {
      game.destruir()
      gameRef.current = null
    }
  }, [])

  // Escala o mundo 400x700 para caber na área, sem distorcer
  useEffect(() => {
    const area = areaRef.current
    const observador = new ResizeObserver(([entrada]) => {
      const { width, height } = entrada.contentRect
      const escala = Math.min(width / LARGURA, height / ALTURA)
      const novo = { w: Math.floor(LARGURA * escala), h: Math.floor(ALTURA * escala) }
      tamanhoRef.current = novo
      setTamanho(novo)
      gameRef.current?.redimensionar(novo.w, novo.h, window.devicePixelRatio || 1)
    })
    observador.observe(area)
    return () => observador.disconnect()
  }, [])

  // Sem rolar a página por trás do jogo
  useEffect(() => {
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = antes
    }
  }, [])

  // Esc: pausa durante a partida; fora dela, volta para o início
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (fase === 'jogando') gameRef.current?.pausar()
      else if (fase !== 'vitoria') onInicio()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fase, onInicio])

  const comecar = () => {
    setColetados(0)
    setVidas(VIDAS)
    setResultado(null)
    gameRef.current?.iniciar()
    setFase('jogando')
  }

  const continuar = () => {
    gameRef.current?.continuar()
    setFase('jogando')
  }

  const textoRecorde = `${jogo.recorde}: ${recorde.mimos}`

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      transition={{ duration: 0.5 }}
      className="relative z-10 flex h-[100dvh] w-full p-2 sm:p-5"
    >
      <div ref={areaRef} className="flex h-full w-full items-center justify-center">
        <div
          className="relative overflow-hidden rounded-[26px] shadow-2xl shadow-rosa-mid/40 ring-4 ring-white/70"
          style={{ width: tamanho?.w ?? 0, height: tamanho?.h ?? 0 }}
        >
          <canvas
            ref={canvasRef}
            className="block h-full w-full touch-none select-none"
            style={{ touchAction: 'none' }}
          />

          {/* HUD */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3">
            <div className="flex flex-col items-start gap-1">
              <button onClick={onInicio} className={botaoPequeno}>
                <Home size={16} />
                {jogo.inicio}
              </button>
              {/* vidas: corações rosa cheios/vazios */}
              <div
                className="flex items-center gap-0.5 rounded-full bg-white/70 px-2 py-1"
                aria-label={`${vidas} ${jogo.vidas}`}
              >
                {Array.from({ length: VIDAS }, (_, i) => (
                  <motion.span
                    key={`${i}-${i < vidas}`}
                    initial={{ scale: i < vidas ? 1 : 1.7 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                  >
                    <Heart
                      size={15}
                      fill={i < vidas ? '#FF4E8B' : 'none'}
                      className={i < vidas ? 'text-rosa-deep' : 'text-rosa-mid/50'}
                    />
                  </motion.span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <motion.div
                key={coletados}
                initial={{ scale: coletados > 0 ? 1.3 : 1 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 font-serif text-lg font-bold text-rosa-deep shadow-md shadow-rosa-mid/20 ring-1 ring-rosa-soft"
              >
                <Heart size={16} fill="#E0182D" className="text-[#E0182D]" />
                {coletados} / {META_MIMOS}
              </motion.div>
              <p className="rounded-full bg-white/70 px-2.5 py-0.5 font-hand text-base leading-tight text-rosa-deep/80">
                {textoRecorde}
                {recorde.tempo ? ` · ${formatarTempo(recorde.tempo)}` : ''}
              </p>
            </div>
          </div>

          <AnimatePresence>
            {fase === 'inicio' && (
              <Painel key="inicio">
                <h1 className="text-gradient font-serif text-3xl font-black leading-tight">{jogo.titulo}</h1>
                <p className="font-hand text-2xl leading-snug text-rosa-deep/90">{jogo.frase}</p>

                <div className="grid w-full grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-rosa-bg px-1 py-2">
                    <p className="font-serif text-sm font-bold text-rosa-deep">{jogo.mimos}</p>
                    <div className="flex justify-center">
                      {Object.keys(MIMOS).map((t) => (
                        <MiniDesenho key={t} tipo={t} mimo />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-1 py-2">
                    <p className="font-serif text-sm font-bold text-slate-600">{jogo.estudos}</p>
                    <div className="flex justify-center">
                      {Object.keys(ESTUDOS).map((t) => (
                        <MiniDesenho key={t} tipo={t} />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="font-hand text-xl leading-tight text-rosa-deep">
                  {jogo.meta} · {jogo.vidasInfo}
                </p>
                <p className="font-serif text-sm italic text-rosa-mid">
                  {toque ? jogo.controlesToque : jogo.controlesTeclado}
                </p>
                <button onClick={comecar} className={`${botaoForte} mt-1`}>
                  <Play size={18} fill="currentColor" />
                  {jogo.comecar}
                </button>
              </Painel>
            )}

            {fase === 'pausado' && (
              <Painel key="pausado">
                <h2 className="text-gradient font-serif text-3xl font-black">{jogo.pausado}</h2>
                <p className="font-hand text-xl text-rosa-deep">
                  {coletados} / {META_MIMOS}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={continuar} className={botaoForte}>
                    <Play size={18} fill="currentColor" />
                    {jogo.continuar}
                  </button>
                  <button onClick={onInicio} className={botaoClaro}>
                    <Home size={18} />
                    {jogo.inicio}
                  </button>
                </div>
              </Painel>
            )}

            {fase === 'fim' && resultado && (
              <Painel key="fim">
                <MiniDesenho tipo="beijo" mimo tamanho={56} />
                <h2 className="text-gradient font-serif text-3xl font-black leading-tight">{jogo.gameOver}</h2>
                <p className="font-hand text-2xl text-rosa-deep/90">
                  {jogo.vocePegouAntes} {resultado.mimos} / {META_MIMOS} {jogo.vocePegouDepois}
                </p>
                {resultado.novoRecorde && (
                  <motion.p
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 12 }}
                    className="rounded-full bg-gradient-to-r from-rosa-deep to-[#e0398b] px-4 py-1 font-hand text-xl text-white shadow-md shadow-rosa-deep/30"
                  >
                    {jogo.novoRecorde}
                  </motion.p>
                )}
                <p className="font-serif text-sm text-rosa-mid">
                  {textoRecorde} {jogo.vocePegouDepois}
                  {recorde.tempo ? ` · ${jogo.melhorTempo}: ${formatarTempo(recorde.tempo)}` : ''}
                </p>
                <div className="mt-1 flex flex-wrap justify-center gap-2">
                  <button onClick={comecar} className={botaoForte}>
                    <RotateCcw size={18} />
                    {jogo.jogarDeNovo}
                  </button>
                  <button onClick={onInicio} className={botaoClaro}>
                    <Home size={18} />
                    {jogo.inicio}
                  </button>
                </div>
              </Painel>
            )}

            {fase === 'vitoria' && (
              <Painel key="vitoria" atraso={1.2}>
                <MiniDesenho tipo="coracao" mimo tamanho={56} />
                <h2 className="text-gradient font-serif text-3xl font-black leading-tight">{jogo.vitoria}</h2>
                <p className="font-hand text-2xl leading-snug text-rosa-deep/90">{jogo.vitoriaTexto}</p>
                <button onClick={onVencer} className={`${botaoForte} mt-1 animate-glow`}>
                  <Gift size={18} />
                  {jogo.colherRecompensa}
                </button>
              </Painel>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}
