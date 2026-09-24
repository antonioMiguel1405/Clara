import { CHAO_Y, CORES_LIVRO, ESTUDOS, FAIXA_TOPO } from './constantes.js'
import { DESENHAR_ESTUDO } from './desenhos.js'

// Um "estudo" caindo: livro, dentadura ou professor.
// A velocidade é fixada no nascimento, então dá para prever
// exatamente quando ele passa pela altura da Clara.
export class Obstacle {
  constructor(tipo, x, velocidade, opcoes = {}) {
    const base = ESTUDOS[tipo]
    this.tipo = tipo
    this.largura = opcoes.largura ?? base.largura
    this.altura = base.altura
    this.hitLargura = this.largura - (base.largura - base.hitLargura)
    this.hitAltura = base.hitAltura
    this.x = x
    this.y = -this.altura / 2 - 4
    this.vy = velocidade
    this.barreira = Boolean(opcoes.barreira)
    this.cor = CORES_LIVRO[Math.floor(Math.random() * CORES_LIVRO.length)]
    this.fase = Math.random() * Math.PI * 2
    this.raspou = false // passou pertinho da Clara
    this.passou = false
  }

  // Janela de tempo (a partir de agora) em que a hitbox cruza a faixa da Clara
  static janela(tipo, velocidade, agora) {
    const base = ESTUDOS[tipo]
    const y0 = -base.altura / 2 - 4
    const meia = base.hitAltura / 2
    return {
      entra: agora + (FAIXA_TOPO - meia - y0) / velocidade,
      sai: agora + (CHAO_Y + meia - y0) / velocidade,
    }
  }

  atualizar(dt) {
    this.y += this.vy * dt
    this.fase += dt
  }

  get hitbox() {
    return {
      x1: this.x - this.hitLargura / 2,
      x2: this.x + this.hitLargura / 2,
      y1: this.y - this.hitAltura / 2,
      y2: this.y + this.hitAltura / 2,
    }
  }

  get foraDaTela() {
    return this.y - this.altura / 2 > 720
  }

  desenhar(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    const opcoes = { largura: this.largura, altura: this.altura }
    if (this.tipo === 'livro') {
      ctx.rotate(Math.sin(this.fase * 2.2) * (this.barreira ? 0.04 : 0.18))
      opcoes.cor = this.cor
    } else if (this.tipo === 'dentadura') {
      opcoes.abertura = (Math.sin(this.fase * 11) + 1) / 2 // mordendo
    } else {
      ctx.rotate(Math.sin(this.fase * 2.4) * 0.08) // balanço
    }
    DESENHAR_ESTUDO[this.tipo](ctx, opcoes)
    ctx.restore()
  }
}
