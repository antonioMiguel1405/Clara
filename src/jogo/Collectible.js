import { MIMOS, MIMO_RAIO_COLETA } from './constantes.js'
import { DESENHAR_MIMO, desenharAura } from './desenhos.js'

// Cores das partículas quando cada mimo é pego
export const CORES_MIMO = {
  coracao: ['#E0182D', '#FF4E8B', '#FFB6CE'],
  beijo: ['#E8336E', '#FF8FB1', '#FFFFFF'],
  sushi: ['#FF8A5B', '#FFFDF7', '#24372D'],
}

// Um "mimo" caindo: coração, beijo ou sushi.
export class Collectible {
  constructor(tipo, x, velocidade) {
    this.tipo = tipo
    this.valor = MIMOS[tipo].valor
    this.tamanho = MIMOS[tipo].tamanho
    this.raio = MIMO_RAIO_COLETA
    this.x = x
    this.y = -this.tamanho
    this.vy = velocidade
    this.t = Math.random() * 2
  }

  atualizar(dt) {
    this.y += this.vy * dt
    this.t += dt
  }

  get foraDaTela() {
    return this.y - this.tamanho > 720
  }

  desenhar(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y + Math.sin(this.t * 3) * 1.5)
    desenharAura(ctx, this.tamanho * 0.95, this.t)
    ctx.rotate(Math.sin(this.t * 2) * 0.1)
    DESENHAR_MIMO[this.tipo](ctx, { tamanho: this.tamanho, t: this.t })
    ctx.restore()
  }
}
