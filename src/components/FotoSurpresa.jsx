import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Heart, Home, Images, Mail } from 'lucide-react'
import FolhaFoto from './FolhaFoto.jsx'
import { fotoSurpresa, fotosSurpresa } from '../data/content.js'

const botaoClaro =
  'flex items-center gap-2 rounded-full bg-white/85 px-5 py-2.5 font-hand text-xl text-rosa-deep shadow-md shadow-rosa-mid/20 ring-1 ring-rosa-soft backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-rosa-mid/40'
const botaoForte =
  'flex items-center gap-2 rounded-full bg-gradient-to-r from-rosa-deep to-[#e0398b] px-6 py-2.5 font-hand text-xl text-white shadow-lg shadow-rosa-deep/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-rosa-mid/40'

function sortear(vistas) {
  const restantes = fotosSurpresa.filter((f) => !vistas.includes(f))
  if (restantes.length === 0) return null
  return restantes[Math.floor(Math.random() * restantes.length)]
}

export default function FotoSurpresa() {
  // A "sessão" vive só na memória: recarregar a página zera o rolo e libera
  // todas as fotos de novo.
  const [vistas, setVistas] = useState([])
  // null = fechado | { tipo: 'foto', src, animar, doRolo } | { tipo: 'rolo' }
  const [tela, setTela] = useState(null)
  const [aberta, setAberta] = useState(false)

  const acabou = vistas.length >= fotosSurpresa.length

  const abrirNova = useCallback(() => {
    const src = sortear(vistas)
    if (!src) return
    setVistas((v) => [...v, src])
    setAberta(false)
    setTela({ tipo: 'foto', src, animar: true, doRolo: false })
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
                ) : (
                  <TelaRolo
                    key="rolo"
                    vistas={vistas}
                    onVer={(src) => {
                      setAberta(false)
                      setTela({ tipo: 'foto', src, animar: false, doRolo: true })
                    }}
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
      <FolhaFoto src={tela.src} animar={tela.animar} onAberta={onAberta} />

      {/* Os botões só aparecem depois que a carta termina de abrir. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={aberta ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`flex flex-col items-center gap-4 ${aberta ? '' : 'pointer-events-none'}`}
      >
        {tela.doRolo ? (
          <button onClick={onRolo} className={botaoClaro}>
            <ArrowLeft size={18} />
            {fotoSurpresa.voltarRolo}
          </button>
        ) : (
          <>
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
          </>
        )}
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
              onClick={() => onVer(src)}
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
