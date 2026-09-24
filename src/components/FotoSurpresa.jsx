import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Home, Images, Mail } from 'lucide-react'
import FolhaFoto from './FolhaFoto.jsx'
import { botaoClaro, botaoForte } from './botoes.js'
import { fotoSurpresa, fotosSurpresa } from '../data/content.js'

function sortear(vistas) {
  const restantes = fotosSurpresa.filter((f) => !vistas.includes(f))
  if (restantes.length === 0) return null
  return restantes[Math.floor(Math.random() * restantes.length)]
}

export default function FotoSurpresa() {
  // A "sessão" vive só na memória: recarregar a página zera o rolo e libera
  // todas as fotos de novo.
  const [vistas, setVistas] = useState([])
  // null = fechado | { tipo: 'foto', src } | { tipo: 'rolo' } | { tipo: 'galeria', indice }
  const [tela, setTela] = useState(null)
  const [aberta, setAberta] = useState(false)

  const acabou = vistas.length >= fotosSurpresa.length

  const abrirNova = useCallback(() => {
    const src = sortear(vistas)
    if (!src) return
    setVistas((v) => [...v, src])
    setAberta(false)
    setTela({ tipo: 'foto', src })
  }, [vistas])

  const fechar = useCallback(() => setTela(null), [])

  // Enquanto a tela está aberta: sem rolar o fundo, e Esc fecha.
  useEffect(() => {
    if (!tela) return
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && fechar()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = antes
      window.removeEventListener('keydown', onKey)
    }
  }, [tela, fechar])

  if (fotosSurpresa.length === 0) {
    return <p className="font-hand text-xl text-rosa-mid">{fotoSurpresa.vazio}</p>
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <motion.button
          onClick={abrirNova}
          disabled={acabou}
          whileHover={acabou ? undefined : { scale: 1.05 }}
          whileTap={acabou ? undefined : { scale: 0.94 }}
          className={`${botaoForte} disabled:cursor-default disabled:opacity-60 disabled:hover:brightness-100`}
        >
          <Mail size={20} strokeWidth={1.8} />
          {fotoSurpresa.botao}
        </motion.button>

        {acabou && <p className="max-w-xs font-hand text-lg text-rosa-deep/80">{fotoSurpresa.acabou}</p>}

        {vistas.length > 0 && (
          <button
            onClick={() => setTela({ tipo: 'rolo' })}
            className="flex items-center gap-1.5 font-hand text-lg text-rosa-mid underline-offset-4 hover:underline"
          >
            <Images size={16} />
            {fotoSurpresa.rolo} ({vistas.length})
          </button>
        )}
      </div>

      {/* Portal: a tela cheia não pode ficar dentro da seção animada da home,
          porque um `transform` no pai quebra o `position: fixed`. */}
      {createPortal(
        <AnimatePresence>
          {tela && (
            <motion.div
              key="overlay"
              role="dialog"
              aria-modal="true"
              aria-label={tela.tipo === 'rolo' ? fotoSurpresa.roloTitulo : 'Foto nossa'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-rosa-bg/95 via-white/95 to-rosa-soft/95 backdrop-blur-md"
            >
              <AnimatePresence mode="wait">
                {tela.tipo === 'foto' ? (
                  <TelaFoto
                    key={tela.src}
                    tela={tela}
                    aberta={aberta}
                    onAberta={() => setAberta(true)}
                    acabou={acabou}
                    total={vistas.length}
                    onOutra={abrirNova}
                    onRolo={() => setTela({ tipo: 'rolo' })}
                    onFechar={fechar}
                  />
                ) : tela.tipo === 'galeria' ? (
                  <TelaGaleria
                    key="galeria"
                    vistas={vistas}
                    indiceInicial={tela.indice}
                    onRolo={() => setTela({ tipo: 'rolo' })}
                  />
                ) : (
                  <TelaRolo
                    key="rolo"
                    vistas={vistas}
                    onVer={(indice) => setTela({ tipo: 'galeria', indice })}
                    onFechar={fechar}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

function TelaFoto({ tela, aberta, onAberta, acabou, total, onOutra, onRolo, onFechar }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-full flex-col items-center justify-center gap-6 px-4 py-10 text-center"
    >
      <FolhaFoto src={tela.src} animar onAberta={onAberta} />

      {/* Os botões só aparecem depois que a carta termina de abrir. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={aberta ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`flex flex-col items-center gap-4 ${aberta ? '' : 'pointer-events-none'}`}
      >
        {acabou && <p className="max-w-xs font-hand text-2xl text-rosa-deep/90">{fotoSurpresa.acabou}</p>}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={onFechar} className={botaoClaro}>
            <Home size={18} />
            {fotoSurpresa.voltar}
          </button>
          {!acabou && (
            <button onClick={onOutra} className={botaoForte}>
              <Heart size={18} fill="currentColor" strokeWidth={0} />
              {fotoSurpresa.outra}
            </button>
          )}
        </div>

        <button
          onClick={onRolo}
          className="flex items-center gap-1.5 font-hand text-lg text-rosa-mid underline-offset-4 hover:underline"
        >
          <Images size={16} />
          {fotoSurpresa.rolo} ({total})
        </button>
      </motion.div>
    </motion.div>
  )
}

function TelaRolo({ vistas, onVer, onFechar }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto flex min-h-full w-full max-w-xl flex-col"
    >
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-white/70 px-4 py-3 backdrop-blur-md">
        <button
          onClick={onFechar}
          aria-label={fotoSurpresa.voltar}
          className="flex h-10 w-10 items-center justify-center rounded-full text-rosa-deep transition hover:bg-rosa-soft"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-gradient font-serif text-2xl font-bold">{fotoSurpresa.roloTitulo}</h2>
        <span className="w-10 text-right font-hand text-lg text-rosa-mid">{vistas.length}</span>
      </header>

      {/* Grade quadradinha, igual galeria de celular */}
      <ul className="grid grid-cols-3 gap-1 p-1 pb-10">
        {vistas.map((src, i) => (
          <motion.li
            key={src}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: Math.min(i, 12) * 0.03 }}
          >
            <button
              onClick={() => onVer(i)}
              aria-label={`Ver foto ${i + 1}`}
              className="block aspect-square w-full overflow-hidden rounded-md bg-rosa-soft focus:outline-none focus-visible:ring-4 focus-visible:ring-rosa-mid/50"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover transition duration-300 hover:scale-105"
              />
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

// Visualizador estilo galeria de celular: as fotos ficam lado a lado numa
// faixa, e arrastar para os lados troca de foto. Nas pontas a faixa só
// "estica" e volta — não dá a volta para o começo, igual no celular.
function TelaGaleria({ vistas, indiceInicial, onRolo }) {
  const [indice, setIndice] = useState(indiceInicial)
  const indiceRef = useRef(indiceInicial)
  const areaRef = useRef(null)
  const largura = useRef(0)
  const x = useMotionValue(0)
  const total = vistas.length

  const irPara = useCallback(
    (novo) => {
      const alvo = Math.max(0, Math.min(total - 1, novo))
      indiceRef.current = alvo
      setIndice(alvo)
      animate(x, -alvo * largura.current, { type: 'spring', stiffness: 320, damping: 34 })
    },
    [total, x],
  )

  // Cada foto ocupa exatamente a largura da tela; remede ao girar o celular.
  useLayoutEffect(() => {
    const medir = () => {
      largura.current = areaRef.current.offsetWidth
      x.set(-indiceRef.current * largura.current)
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [x])

  // Setas do teclado, para quem abrir no computador.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') irPara(indiceRef.current - 1)
      if (e.key === 'ArrowRight') irPara(indiceRef.current + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [irPara])

  // Velocidade do dedo nos últimos 100ms. Medida aqui mesmo porque a do
  // framer-motion vinha bem abaixo da real em gestos curtos e rápidos.
  const amostras = useRef([])
  const registrar = (e) => amostras.current.push({ x: e.clientX, t: e.timeStamp })
  const velocidade = () => {
    const agora = performance.now()
    const recentes = amostras.current.filter((a) => agora - a.t <= 100)
    if (recentes.length < 2) return 0
    const [p, u] = [recentes[0], recentes[recentes.length - 1]]
    return u.t > p.t ? ((u.x - p.x) / (u.t - p.t)) * 1000 : 0
  }

  // Troca de foto se arrastou mais de 1/4 da tela ou fez um "peteleco" rápido.
  const aoSoltar = (_, { offset }) => {
    const limite = largura.current / 4
    const v = velocidade()
    if (offset.x < -limite || (offset.x < 0 && v < -400)) irPara(indiceRef.current + 1)
    else if (offset.x > limite || (offset.x > 0 && v > 400)) irPara(indiceRef.current - 1)
    else irPara(indiceRef.current)
  }

  const seta =
    'absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-rosa-deep shadow-md ring-1 ring-rosa-soft backdrop-blur transition hover:bg-white sm:flex'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex h-[100dvh] flex-col"
    >
      <header className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          onClick={onRolo}
          aria-label={fotoSurpresa.voltarRolo}
          className="flex h-10 w-10 items-center justify-center rounded-full text-rosa-deep transition hover:bg-rosa-soft"
        >
          <ArrowLeft size={22} />
        </button>
        <span className="font-hand text-xl text-rosa-mid tabular-nums">
          {indice + 1} de {total}
        </span>
        <span className="w-10" />
      </header>

      <div
        ref={areaRef}
        onPointerDown={(e) => {
          amostras.current = []
          registrar(e)
        }}
        onPointerMove={registrar}
        className="relative min-h-0 flex-1 overflow-hidden"
      >
        <motion.ul
          drag="x"
          dragConstraints={areaRef}
          dragElastic={0.18}
          dragMomentum={false}
          onDragEnd={aoSoltar}
          style={{ x, width: `${total * 100}%`, touchAction: 'pan-y' }}
          className="flex h-full cursor-grab active:cursor-grabbing"
        >
          {vistas.map((src, i) => (
            <li
              key={src}
              style={{ width: `${100 / total}%` }}
              className="flex h-full items-center justify-center px-4 pb-6 sm:px-20"
              aria-hidden={i !== indice}
            >
              <img
                src={src}
                alt={`Foto ${i + 1} de ${total}`}
                draggable={false}
                className="pointer-events-none max-h-full max-w-full select-none rounded-xl object-contain shadow-xl shadow-rosa-deep/20"
              />
            </li>
          ))}
        </motion.ul>

        {indice > 0 && (
          <button onClick={() => irPara(indice - 1)} aria-label="Foto anterior" className={`${seta} left-3`}>
            <ChevronLeft size={24} />
          </button>
        )}
        {indice < total - 1 && (
          <button onClick={() => irPara(indice + 1)} aria-label="Próxima foto" className={`${seta} right-3`}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </motion.div>
  )
}
