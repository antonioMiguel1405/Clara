import {
  CAMINHO,
  CHAO_Y,
  DIFICULDADE,
  ESTUDOS,
  FAIXA_TOPO,
  LARGURA,
  MIMOS,
  MIMO_DESVIO_CAMINHO,
  MIMO_INTERVALO,
  MIMO_VELOCIDADE,
  aleatorio,
  clamp,
  lerp,
} from './constantes.js'
import { Obstacle } from './Obstacle.js'
import { Collectible } from './Collectible.js'

const TIPOS_MIMO = Object.keys(MIMOS)

// Gera estudos e mimos de forma procedural, mas sempre justa.
//
// Garantia de saída: existe um "caminho seguro" — uma linha que passeia
// pela tela ao longo do tempo, bem mais devagar que a Clara consegue
// andar. Como cada estudo cai com velocidade fixa, dá para saber
// exatamente quando ele cruza a altura da Clara; um estudo só nasce se,
// nessa janela, não encostar no caminho. Os mimos nascem em cima do
// caminho, então também sempre dá para pegá-los sem morrer.
export class Spawner {
  constructor() {
    this.reiniciar()
  }

  reiniciar() {
    this.caminho = [{ t: 0, x: LARGURA / 2 }]
    this.proximoEstudo = 1.2
    this.proximoMimo = 1.4
    this.proximaBarreira = DIFICULDADE.primeiraBarreira
  }

  // --- Caminho seguro ------------------------------------------
  estenderCaminho(ate) {
    let ultimo = this.caminho[this.caminho.length - 1]
    while (ultimo.t < ate) {
      const dt = aleatorio(...CAMINHO.passo)
      const alcance = CAMINHO.velMax * dt
      const x = clamp(ultimo.x + aleatorio(-alcance, alcance), CAMINHO.margemX, LARGURA - CAMINHO.margemX)
      ultimo = { t: ultimo.t + dt, x }
      this.caminho.push(ultimo)
    }
  }

  podarCaminho(agora) {
    while (this.caminho.length > 2 && this.caminho[1].t < agora - 1) this.caminho.shift()
  }

  xSeguro(t) {
    const c = this.caminho
    for (let i = 1; i < c.length; i++) {
      if (c[i].t >= t) {
        const a = c[i - 1]
        const b = c[i]
        const k = clamp((t - a.t) / (b.t - a.t), 0, 1)
        return a.x + (b.x - a.x) * k
      }
    }
    return c[c.length - 1].x
  }

  // O intervalo [x - meia, x + meia] fica longe do caminho durante [t1, t2]?
  livreDoCaminho(x, meia, t1, t2) {
    const limite = meia + CAMINHO.meiaLargura
    for (let t = t1; t < t2; t += 0.03) {
      if (Math.abs(this.xSeguro(t) - x) < limite) return false
    }
    return Math.abs(this.xSeguro(t2) - x) >= limite
  }

  // --- Geração --------------------------------------------------
  atualizar(agora, d, existentes) {
    this.estenderCaminho(agora + CAMINHO.horizonte)
    this.podarCaminho(agora)

    const novosEstudos = []
    const novosMimos = []
    const mult = lerp(DIFICULDADE.velocidadeMult, d)

    if (agora >= this.proximaBarreira && existentes.some((e) => e.y < 70)) {
      this.proximaBarreira = agora + 0.2 // espera o topo liberar para a fileira não encavalar
    } else if (agora >= this.proximaBarreira) {
      novosEstudos.push(...this.criarBarreira(agora, d, mult))
      this.proximaBarreira = agora + lerp(DIFICULDADE.intervaloBarreira, d) * aleatorio(0.8, 1.25)
      // respiro depois da barreira
      this.proximoEstudo = Math.max(this.proximoEstudo, agora + 0.6)
    }

    if (agora >= this.proximoEstudo) {
      const triplo = lerp(DIFICULDADE.chanceTriplo, d)
      const duplo = lerp(DIFICULDADE.chanceDuplo, d)
      const r = Math.random()
      const qtd = r < triplo ? 3 : r < triplo + duplo ? 2 : 1
      for (let i = 0; i < qtd; i++) {
        const e = this.criarEstudo(agora, d, mult, existentes, novosEstudos)
        if (e) novosEstudos.push(e)
      }
      this.proximoEstudo = agora + lerp(DIFICULDADE.intervaloEstudo, d) * aleatorio(0.75, 1.25)
    }

    if (agora >= this.proximoMimo) {
      novosMimos.push(this.criarMimo(agora, d))
      this.proximoMimo = agora + aleatorio(...MIMO_INTERVALO)
    }

    return { novosEstudos, novosMimos }
  }

  sortearTipo(d) {
    const pesos = Object.entries(DIFICULDADE.pesoTipos).map(([tipo, par]) => [tipo, lerp(par, d)])
    const total = pesos.reduce((s, [, p]) => s + p, 0)
    let r = Math.random() * total
    for (const [tipo, p] of pesos) {
      r -= p
      if (r <= 0) return tipo
    }
    return pesos[0][0]
  }

  criarEstudo(agora, d, mult, existentes, novos) {
    const tipo = this.sortearTipo(d)
    const base = ESTUDOS[tipo]
    const v = base.velocidade * mult * aleatorio(0.92, 1.08)
    const { entra, sai } = Obstacle.janela(tipo, v, agora)
    const meiaVisual = base.largura / 2

    for (let tentativa = 0; tentativa < 10; tentativa++) {
      const x = aleatorio(meiaVisual + 2, LARGURA - meiaVisual - 2)
      if (!this.livreDoCaminho(x, base.hitLargura / 2, entra - 0.06, sai + 0.06)) continue
      // não nascer em cima de outro estudo lá no topo
      const encosta = [...existentes, ...novos].some(
        (e) => e.y < 120 && Math.abs(e.x - x) < (e.largura + base.largura) / 2 + 6,
      )
      if (encosta) continue
      return new Obstacle(tipo, x, v)
    }
    return null // não achou lugar justo: pula desta vez
  }

  // Fileira de livros com uma abertura em cima do caminho seguro
  criarBarreira(agora, d, mult) {
    const v = ESTUDOS.livro.velocidade * mult * 0.85
    const { entra, sai } = Obstacle.janela('livro', v, agora)

    let min = Infinity
    let max = -Infinity
    for (let t = entra - 0.06; t <= sai + 0.06; t += 0.03) {
      const x = this.xSeguro(t)
      min = Math.min(min, x)
      max = Math.max(max, x)
    }
    const folga = CAMINHO.meiaLargura + 4
    let a = min - folga
    let b = max + folga
    const vao = lerp(DIFICULDADE.vaoBarreira, d)
    if (b - a < vao) {
      const c = (a + b) / 2
      a = c - vao / 2
      b = c + vao / 2
    }
    if (a < 0) {
      b -= a
      a = 0
    }
    if (b > LARGURA) {
      a -= b - LARGURA
      b = LARGURA
    }

    const livros = []
    const preencher = (ini, fim) => {
      const espaco = fim - ini
      if (espaco < 18) return // fresta que nem cabe um livro: fica livre
      const n = Math.max(1, Math.round(espaco / 44))
      const w = espaco / n
      for (let i = 0; i < n; i++) {
        livros.push(new Obstacle('livro', ini + w * (i + 0.5), v, { largura: w - 2, barreira: true }))
      }
    }
    preencher(0, a)
    preencher(b, LARGURA)
    return livros
  }

  criarMimo(agora, d) {
    const tipo = TIPOS_MIMO[Math.floor(Math.random() * TIPOS_MIMO.length)]
    const v = MIMO_VELOCIDADE * (1 + 0.35 * d)
    const y0 = -MIMOS[tipo].tamanho
    const meio = agora + ((FAIXA_TOPO + CHAO_Y) / 2 - y0) / v
    const x = clamp(
      this.xSeguro(meio) + aleatorio(-MIMO_DESVIO_CAMINHO, MIMO_DESVIO_CAMINHO),
      24,
      LARGURA - 24,
    )
    return new Collectible(tipo, x, v)
  }
}
