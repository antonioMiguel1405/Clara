import { CHAO_Y, JOGADORA, LARGURA, clamp } from './constantes.js'
import { desenharClara } from './desenhos.js'

// A Clara: anda só na horizontal, com aceleração suave no teclado
// e seguindo o dedo (arraste relativo) no toque.
export class Player {
  constructor() {
    this.reiniciar()
  }

  reiniciar() {
    this.x = LARGURA / 2
    this.vx = 0
    this.alvoToque = null // x desejado enquanto controla pelo toque
    this.andar = 0
    this.movimento = 0
    this.desvioCabelo = 0
    this.inclinacao = 0
    this.surpresa = false
    this.tempoSusto = 0 // cara de susto passageira depois de um golpe
    this.piscar = 0
  }

  atualizar(dt, entrada) {
    const dir = (entrada.direita ? 1 : 0) - (entrada.esquerda ? 1 : 0)

    if (dir !== 0) {
      // Teclado: virar para o lado oposto é mais rápido que acelerar do zero
      this.alvoToque = null
      const virando = Math.sign(this.vx) === -dir
      this.vx += dir * JOGADORA.acel * (virando ? 2 : 1) * dt
      this.vx = clamp(this.vx, -JOGADORA.velMax, JOGADORA.velMax)
    } else if (this.alvoToque !== null) {
      const desejada = clamp(
        (this.alvoToque - this.x) * JOGADORA.rigidezToque,
        -JOGADORA.velMaxToque,
        JOGADORA.velMaxToque,
      )
      this.vx += (desejada - this.vx) * Math.min(1, dt * 22)
    } else {
      // sem comando: desacelera até parar
      const freio = JOGADORA.atrito * dt
      this.vx = Math.abs(this.vx) <= freio ? 0 : this.vx - Math.sign(this.vx) * freio
    }

    this.x += this.vx * dt
    const min = JOGADORA.margem
    const max = LARGURA - JOGADORA.margem
    if (this.x < min || this.x > max) {
      this.x = clamp(this.x, min, max)
      this.vx = 0
    }
    if (this.alvoToque !== null) this.alvoToque = clamp(this.alvoToque, min, max)

    this.animar(dt)
  }

  animar(dt) {
    const rapidez = Math.min(1, Math.abs(this.vx) / JOGADORA.velMax)
    this.movimento += (rapidez - this.movimento) * Math.min(1, dt * 10)
    this.andar += dt * (4 + 12 * rapidez)
    // cabelo e corpo acompanham o movimento com um pequeno atraso
    const cabeloAlvo = clamp(-this.vx * 0.014, -6, 6)
    this.desvioCabelo += (cabeloAlvo - this.desvioCabelo) * Math.min(1, dt * 7)
    const inclinacaoAlvo = (this.vx / JOGADORA.velMax) * 0.12
    this.inclinacao += (inclinacaoAlvo - this.inclinacao) * Math.min(1, dt * 12)
    if (this.piscar > 0) this.piscar -= dt
    if (this.tempoSusto > 0) this.tempoSusto -= dt
  }

  // Começa um arraste: o alvo parte de onde ela está
  iniciarToque() {
    this.alvoToque = this.x
  }

  moverToque(dx) {
    if (this.alvoToque === null) this.alvoToque = this.x
    this.alvoToque += dx
  }

  // --- Hitbox: só cabeça e corpo --------------------------------
  get cabeca() {
    return { cx: this.x, cy: CHAO_Y + JOGADORA.cabecaY, r: JOGADORA.cabecaR }
  }

  get corpo() {
    return {
      x1: this.x - JOGADORA.corpoMeiaLargura,
      x2: this.x + JOGADORA.corpoMeiaLargura,
      y1: CHAO_Y + JOGADORA.corpoTopo,
      y2: CHAO_Y,
    }
  }

  colideRetangulo(r) {
    const c = this.corpo
    if (r.x1 < c.x2 && r.x2 > c.x1 && r.y1 < c.y2 && r.y2 > c.y1) return true
    const h = this.cabeca
    return circuloEmRetangulo(h.cx, h.cy, h.r, r)
  }

  colideCirculo(cx, cy, r) {
    const h = this.cabeca
    if ((h.cx - cx) ** 2 + (h.cy - cy) ** 2 < (h.r + r) ** 2) return true
    return circuloEmRetangulo(cx, cy, r, this.corpo)
  }

  desenhar(ctx) {
    // pisca depois de um golpe
    if (this.piscar > 0 && Math.floor(this.piscar / 0.08) % 2 === 0) return

    // sombrinha no chão
    ctx.fillStyle = 'rgba(224, 69, 123, 0.18)'
    ctx.beginPath()
    ctx.ellipse(this.x, CHAO_Y + 1, 13, 3.2, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.save()
    const pulo = Math.abs(Math.sin(this.andar)) * 1.6 * this.movimento
    ctx.translate(this.x, CHAO_Y - pulo)
    ctx.rotate(this.inclinacao)
    desenharClara(ctx, {
      andar: this.andar,
      movimento: this.movimento,
      desvioCabelo: this.desvioCabelo,
      surpresa: this.surpresa || this.tempoSusto > 0,
    })
    ctx.restore()
  }
}

export function circuloEmRetangulo(cx, cy, r, ret) {
  const px = clamp(cx, ret.x1, ret.x2)
  const py = clamp(cy, ret.y1, ret.y2)
  return (cx - px) ** 2 + (cy - py) ** 2 < r * r
}
