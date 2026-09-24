import { aleatorio } from './constantes.js'
import { caminhoCoracao } from './desenhos.js'

const MAXIMO = 320

// Partículas simples: bolinhas, coraçõezinhos e textos que sobem e somem.
export class ParticleSystem {
  constructor() {
    this.particulas = []
  }

  limpar() {
    this.particulas.length = 0
  }

  adicionar(p) {
    if (this.particulas.length >= MAXIMO) this.particulas.shift()
    this.particulas.push(p)
  }

  explosao(x, y, { qtd = 10, cores = ['#FF8FB1'], forma = 'circulo', vel = [40, 140], tamanho = [2, 4], vida = [0.4, 0.8], gravidade = 0, subida = 0 } = {}) {
    for (let i = 0; i < qtd; i++) {
      const ang = Math.random() * Math.PI * 2
      const v = aleatorio(...vel)
      const vidaMax = aleatorio(...vida)
      this.adicionar({
        x,
        y,
        vx: Math.cos(ang) * v,
        vy: Math.sin(ang) * v - subida,
        vida: vidaMax,
        vidaMax,
        tamanho: aleatorio(...tamanho),
        cor: cores[Math.floor(Math.random() * cores.length)],
        forma,
        gravidade,
      })
    }
  }

  texto(x, y, texto, { cor = '#FF4E8B', tamanho = 26, vida = 0.9 } = {}) {
    this.adicionar({ x, y, vx: 0, vy: -55, vida, vidaMax: vida, tamanho, cor, forma: 'texto', texto, gravidade: 0 })
  }

  atualizar(dt) {
    for (const p of this.particulas) {
      p.vida -= dt
      p.vy += p.gravidade * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      if (p.forma !== 'texto') {
        p.vx *= 1 - Math.min(1, dt * 2)
      }
    }
    this.particulas = this.particulas.filter((p) => p.vida > 0)
  }

  desenhar(ctx) {
    for (const p of this.particulas) {
      const k = p.vida / p.vidaMax
      ctx.globalAlpha = Math.min(1, k * 1.6)
      ctx.fillStyle = p.cor
      if (p.forma === 'texto') {
        ctx.save()
        ctx.font = `700 ${p.tamanho}px Caveat, cursive`
        ctx.textAlign = 'center'
        ctx.lineWidth = 4
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        ctx.strokeText(p.texto, p.x, p.y)
        ctx.fillText(p.texto, p.x, p.y)
        ctx.restore()
      } else if (p.forma === 'coracao') {
        ctx.save()
        ctx.translate(p.x, p.y)
        caminhoCoracao(ctx, p.tamanho * 2.4)
        ctx.fill()
        ctx.restore()
      } else {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.tamanho * (0.5 + k * 0.5), 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
  }
}
