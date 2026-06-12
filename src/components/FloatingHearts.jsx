import { Heart, Sparkle, Star } from 'lucide-react'

// Elementos decorativos estáticos/flutuantes espalhados pelo fundo.
// Gerados uma vez com posições fixas para não "pular" a cada render.
const DECOR = [
  { Icon: Heart, top: '12%', left: '8%', size: 18, delay: '0s', color: '#FFB6CE' },
  { Icon: Sparkle, top: '20%', left: '88%', size: 16, delay: '1.2s', color: '#FFC8DD' },
  { Icon: Star, top: '70%', left: '6%', size: 14, delay: '0.6s', color: '#FFD6E6' },
  { Icon: Heart, top: '78%', left: '90%', size: 20, delay: '2s', color: '#FF9EBD' },
  { Icon: Sparkle, top: '40%', left: '4%', size: 13, delay: '1.8s', color: '#FFD0E0' },
  { Icon: Star, top: '34%', left: '94%', size: 15, delay: '0.3s', color: '#FFBBD4' },
  { Icon: Heart, top: '52%', left: '92%', size: 13, delay: '2.6s', color: '#FFC8DD' },
  { Icon: Sparkle, top: '60%', left: '10%', size: 14, delay: '0.9s', color: '#FFB6CE' },
  { Icon: Heart, top: '88%', left: '46%', size: 12, delay: '1.5s', color: '#FFD6E6' },
  { Icon: Star, top: '8%', left: '50%', size: 12, delay: '2.2s', color: '#FFC8DD' },
]

export default function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {DECOR.map(({ Icon, top, left, size, delay, color }, i) => (
        <Icon
          key={i}
          className="absolute animate-floaty"
          style={{ top, left, animationDelay: delay, color }}
          fill={color}
          strokeWidth={1}
          size={size}
        />
      ))}
    </div>
  )
}
