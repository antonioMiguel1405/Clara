import { useEffect, useRef, useState } from 'react'
import { Music, Pause, Play, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { playlist } from '../data/content.js'

// Player discreto e fixo no canto. Tenta tocar automaticamente;
// se o navegador bloquear o autoplay, basta um toque no botão play.
export default function MusicPlayer({ autoStart }) {
  const audioRef = useRef(null)
  const [track, setTrack] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  // Inicia ao revelar a mensagem
  useEffect(() => {
    if (!autoStart || !audioRef.current) return
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false)) // autoplay bloqueado — usuário clica no play
  }, [autoStart])

  const togglePlay = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) {
      a.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      a.pause()
      setPlaying(false)
    }
  }

  const next = () => setTrack((t) => (t + 1) % playlist.length)

  const toggleMute = () => {
    const a = audioRef.current
    if (!a) return
    a.muted = !a.muted
    setMuted(a.muted)
  }

  const current = playlist[track]

  return (
    <div className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2">
      <audio
        ref={audioRef}
        src={current.src}
        autoPlay={autoStart}
        onEnded={next}
        loop={playlist.length === 1}
      />
      <div className="flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-3 py-2 shadow-lg shadow-rosa-mid/25 backdrop-blur-md">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rosa-soft text-rosa-deep">
          <Music size={16} className={playing ? 'animate-pulse' : ''} />
        </span>

        <div className="hidden min-w-0 leading-tight sm:block">
          <p className="truncate text-xs font-semibold text-rosa-deep">{current.titulo}</p>
          <p className="truncate text-[10px] text-rosa-mid">{current.artista}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={togglePlay}
            aria-label={playing ? 'Pausar' : 'Tocar'}
            className="rounded-full p-1.5 text-rosa-deep transition hover:bg-rosa-soft"
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {playlist.length > 1 && (
            <button
              onClick={next}
              aria-label="Próxima música"
              className="rounded-full p-1.5 text-rosa-deep transition hover:bg-rosa-soft"
            >
              <SkipForward size={18} />
            </button>
          )}

          <button
            onClick={toggleMute}
            aria-label={muted ? 'Ativar som' : 'Mutar'}
            className="rounded-full p-1.5 text-rosa-deep transition hover:bg-rosa-soft"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  )
}
