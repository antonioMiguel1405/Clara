import { Heart, Sparkles } from 'lucide-react'

// Pequeno divisor decorativo: ✿ — ♡ — ✿
export default function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 text-rosa-mid/70">
      <Sparkles size={14} fill="currentColor" strokeWidth={1} />
      <span className="h-px w-8 bg-rosa-mid/40" />
      <Heart size={14} fill="currentColor" strokeWidth={1} />
      <span className="h-px w-8 bg-rosa-mid/40" />
      <Sparkles size={14} fill="currentColor" strokeWidth={1} />
    </div>
  )
}
