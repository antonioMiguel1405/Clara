import {
  ALTURA,
  BATIDA_DURACAO,
  CHAO_Y,
  CORES,
  DELTA_MAX,
  DIFICULDADE,
  FAIXA_TOPO,
  INVENCIVEL_DURACAO,
  LARGURA,
  META_MIMOS,
  QUASE,
  TREMOR,
  VIDAS,
  aleatorio,
  clamp,
} from './constantes.js'
import { Player } from './Player.js'
import { Spawner } from './Spawner.js'
import { ParticleSystem } from './ParticleSystem.js'
import { CORES_MIMO } from './Collectible.js'
import { caminhoCoracao } from './desenhos.js'

// Dificuldade desejada (0..1): mistura tempo sobrevivido e mimos pegos,
// com um empurrão suave na reta final.
export function calcularDificuldade(tempo, mimos) {
  const D = DIFICULDADE
  const porTempo = Math.min(1, tempo / D.tempoMax)
  const porMimos = Math.min(1, mimos / META_MIMOS)
  const k = clamp((porMimos - D.retaFinalInicio) / (D.retaFinalFim - D.retaFinalInicio), 0, 1)
  const retaFinal = k * k * (3 - 2 * k) * D.retaFinalBonus
  return Math.min(D.teto, D.pesoTempo * porTempo + D.pesoMimos * porMimos + retaFinal)
}

function criarDecor() {
  return Array.from({ length: 9 }, (_, i) => ({
    x: aleatorio(10, LARGURA - 10),
    y: aleatorio(0, ALTURA),
    vy: aleatorio(6, 16),
    tamanho: aleatorio(7, 13),
    fase: aleatorio(0, Math.PI * 2),
    coracao: i % 3 !== 2,
  }))
}

/**
 * Motor do jogo, em JS puro. O React só monta o canvas e escuta os callbacks.
 * Estados: pronto → jogando ⇄ pausado → batida → fim | vitoria
 * `textos` traz os textos que aparecem dentro do canvas ({ quase, perdeuVida }).
 */
export class Game {
  constructor(canvas, callbacks = {}, textos = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.cb = callbacks
    this.textos = { quase: 'quase!', perdeuVida: '-1', ...textos }
    this.jogadora = new Player()
    this.spawner = new Spawner()
    this.particulas = new ParticleSystem()
    this.decor = criarDecor()
    this.entrada = { esquerda: false, direita: false }
    this.escalaCss = 1
    this.escalaCanvas = 1
    this.ultimoFrame = null
    this.relogio = 0 // tempo visual, anda até fora da partida
    this.limparPartida()
    this.estado = 'pronto'

    this.aoTecla = this.aoTecla.bind(this)
    this.aoSoltarTecla = this.aoSoltarTecla.bind(this)
    this.aoPerderFoco = this.aoPerderFoco.bind(this)
    this.aoVisibilidade = this.aoVisibilidade.bind(this)
    this.aoApertar = this.aoApertar.bind(this)
    this.aoArrastar = this.aoArrastar.bind(this)
    this.aoSoltar = this.aoSoltar.bind(this)
    this.loop = this.loop.bind(this)

    window.addEventListener('keydown', this.aoTecla)
    window.addEventListener('keyup', this.aoSoltarTecla)
    window.addEventListener('blur', this.aoPerderFoco)
    document.addEventListener('visibilitychange', this.aoVisibilidade)
    canvas.addEventListener('pointerdown', this.aoApertar)
    canvas.addEventListener('pointermove', this.aoArrastar)
    canvas.addEventListener('pointerup', this.aoSoltar)
    canvas.addEventListener('pointercancel', this.aoSoltar)

    this.raf = requestAnimationFrame(this.loop)
  }

  destruir() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('keydown', this.aoTecla)
    window.removeEventListener('keyup', this.aoSoltarTecla)
    window.removeEventListener('blur', this.aoPerderFoco)
    document.removeEventListener('visibilitychange', this.aoVisibilidade)
    this.canvas.removeEventListener('pointerdown', this.aoApertar)
    this.canvas.removeEventListener('pointermove', this.aoArrastar)
    this.canvas.removeEventListener('pointerup', this.aoSoltar)
    this.canvas.removeEventListener('pointercancel', this.aoSoltar)
  }

  // Tamanho do canvas na tela (px CSS). O mundo lógico é sempre LARGURA x ALTURA.
  redimensionar(larguraCss, alturaCss, dpr = 1) {
    this.canvas.width = Math.round(larguraCss * dpr)
    this.canvas.height = Math.round(alturaCss * dpr)
    this.escalaCss = larguraCss / LARGURA
    this.escalaCanvas = this.canvas.width / LARGURA
    this.fundo = null // o degradê é recriado no próximo quadro
    this.desenhar()
  }

  limparPartida() {
    this.jogadora.reiniciar()
    this.spawner.reiniciar()
    this.particulas.limpar()
    this.estudos = []
    this.mimos = []
    this.tempo = 0
    this.coletados = 0
    this.vidas = VIDAS
    this.invencivel = 0
    this.dificuldade = 0
    this.tremor = 0
    this.brilhoQuase = 0
    this.ultimoQuase = -10
    this.timerBatida = 0
    this.opacidadeEstudos = 1
  }

  // --- Controle da partida -------------------------------------
  iniciar() {
    this.limparPartida()
    this.entrada.esquerda = this.entrada.direita = false
    this.estado = 'jogando'
    this.ultimoFrame = null
  }

  pausar() {
    if (this.estado !== 'jogando') return
    this.estado = 'pausado'
    this.entrada.esquerda = this.entrada.direita = false
    this.jogadora.alvoToque = null
    this.cb.onPausa?.()
  }

  continuar() {
    if (this.estado !== 'pausado') return
    this.estado = 'jogando'
    this.ultimoFrame = null
  }

  // --- Entrada ---------------------------------------------------
  aoTecla(e) {
    const esquerda = e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A'
    const direita = e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D'
    if (!esquerda && !direita) return
    if (this.estado === 'jogando') e.preventDefault()
    if (esquerda) this.entrada.esquerda = true
    if (direita) this.entrada.direita = true
  }

  aoSoltarTecla(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.entrada.esquerda = false
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.entrada.direita = false
  }

  aoPerderFoco() {
    this.entrada.esquerda = this.entrada.direita = false
    this.pausar()
  }

  aoVisibilidade() {
    if (document.hidden) this.pausar()
  }

  // Arraste relativo: o dedo não precisa ficar em cima da Clara
  aoApertar(e) {
    if (this.estado !== 'jogando') return
    this.arrastando = e.pointerId
    this.ultimoXPonteiro = e.clientX
    this.canvas.setPointerCapture?.(e.pointerId)
    this.jogadora.iniciarToque()
  }

  aoArrastar(e) {
    if (this.arrastando !== e.pointerId || this.estado !== 'jogando') return
    const dx = (e.clientX - this.ultimoXPonteiro) / this.escalaCss
    this.ultimoXPonteiro = e.clientX
    this.jogadora.moverToque(dx * 1.15)
  }

  aoSoltar(e) {
    if (this.arrastando === e.pointerId) this.arrastando = null
  }

  // --- Loop -----------------------------------------------------
  loop(agora) {
    this.raf = requestAnimationFrame(this.loop)
    // delta limitado: nada "teleporta" ao voltar de outra aba
    const dt = this.ultimoFrame === null ? 0 : Math.min(DELTA_MAX, (agora - this.ultimoFrame) / 1000)
    this.ultimoFrame = agora
    this.atualizar(dt)
    this.desenhar()
  }

  atualizar(dt) {
    if (this.estado === 'pausado') return
    this.relogio += dt
    for (const d of this.decor) {
      d.y -= d.vy * dt
      d.fase += dt
      if (d.y < -20) {
        d.y = ALTURA + 20
        d.x = aleatorio(10, LARGURA - 10)
      }
    }
    this.particulas.atualizar(dt)
    if (this.tremor > 0) this.tremor -= dt
    if (this.brilhoQuase > 0) this.brilhoQuase -= dt

    switch (this.estado) {
      case 'pronto':
        this.jogadora.atualizar(dt, this.entrada)
        break
      case 'jogando':
        this.passo(dt)
        break
      case 'batida':
        this.jogadora.animar(dt)
        this.timerBatida -= dt
        if (this.timerBatida <= 0) {
          this.estado = 'fim'
          this.cb.onGameOver?.({ mimos: this.coletados, tempo: this.tempo })
        }
        break
      case 'vitoria':
        this.jogadora.atualizar(dt, { esquerda: false, direita: false })
        this.opacidadeEstudos = Math.max(0.25, this.opacidadeEstudos - dt * 1.2)
        if (Math.random() < dt * 8) {
          this.particulas.explosao(this.jogadora.x + aleatorio(-24, 24), CHAO_Y - aleatorio(20, 90), {
            qtd: 1,
            forma: 'coracao',
            cores: ['#FF4E8B', '#E0182D', '#FF8FB1'],
            vel: [10, 30],
            subida: 50,
            tamanho: [3, 5],
            vida: [0.9, 1.4],
          })
        }
        break
      default:
        break
    }
  }

  passo(dt) {
    this.tempo += dt
    if (this.invencivel > 0) this.invencivel -= dt
    const alvo = calcularDificuldade(this.tempo, this.coletados)
    this.dificuldade += (alvo - this.dificuldade) * Math.min(1, dt * DIFICULDADE.suavizacao)

    const { novosEstudos, novosMimos } = this.spawner.atualizar(this.tempo, this.dificuldade, this.estudos)
    for (const e of novosEstudos) {
      this.estudos.push(e)
      // poeirinha quando um estudo aparece no topo
      if (!e.barreira || Math.random() < 0.35) {
        this.particulas.explosao(e.x, 6, {
          qtd: e.barreira ? 3 : 6,
          cores: ['#B39AA8', '#FF8FB1', '#FFFFFF'],
          vel: [20, 70],
          tamanho: [1.5, 3],
          vida: [0.3, 0.6],
        })
      }
    }
    this.mimos.push(...novosMimos)

    this.jogadora.atualizar(dt, this.entrada)
    for (const e of this.estudos) e.atualizar(dt)
    for (const m of this.mimos) m.atualizar(dt)
    this.estudos = this.estudos.filter((e) => !e.foraDaTela)
    this.mimos = this.mimos.filter((m) => !m.foraDaTela)

    // colisão com estudos + "quase!" (piscando depois de um golpe, ela atravessa)
    const corpo = this.jogadora.corpo
    for (const e of this.estudos) {
      const h = e.hitbox
      if (this.invencivel <= 0 && this.jogadora.colideRetangulo(h)) {
        this.levarGolpe(e)
        if (this.estado !== 'jogando') return
        continue
      }
      const naFaixa = h.y2 > FAIXA_TOPO && h.y1 < CHAO_Y
      if (naFaixa) {
        if (this.invencivel > 0) continue
        const distancia = Math.max(h.x1 - corpo.x2, corpo.x1 - h.x2)
        if (distancia < QUASE.distancia) e.raspou = true
      } else if (!e.passou && h.y1 >= CHAO_Y) {
        e.passou = true
        if (e.raspou) this.quase()
      }
    }
    this.estudos = this.estudos.filter((e) => !e.removido)

    // coleta de mimos
    for (let i = this.mimos.length - 1; i >= 0; i--) {
      const m = this.mimos[i]
      if (this.jogadora.colideCirculo(m.x, m.y, m.raio)) {
        this.mimos.splice(i, 1)
        this.coletar(m)
        if (this.estado !== 'jogando') return
      }
    }
  }

  quase() {
    if (this.tempo - this.ultimoQuase < QUASE.intervaloMin) return
    this.ultimoQuase = this.tempo
    this.brilhoQuase = 0.5
    this.particulas.texto(this.jogadora.x, CHAO_Y - 92, this.textos.quase, { cor: CORES.rosaDeep, tamanho: 24, vida: 0.8 })
    this.particulas.explosao(this.jogadora.x, CHAO_Y - 45, {
      qtd: 8,
      forma: 'coracao',
      cores: ['#FFB6CE', '#FF8FB1'],
      vel: [40, 90],
      tamanho: [2, 3],
      vida: [0.4, 0.7],
    })
  }

  coletar(m) {
    this.coletados += m.valor
    this.particulas.explosao(m.x, m.y, {
      qtd: 14,
      forma: m.tipo === 'sushi' ? 'circulo' : 'coracao',
      cores: CORES_MIMO[m.tipo],
      vel: [50, 150],
      tamanho: [2, 4],
      vida: [0.4, 0.8],
    })
    this.particulas.texto(m.x, m.y - 14, `+${m.valor}`, { cor: CORES.rosaDeep, tamanho: 28 })
    this.cb.onColetar?.(this.coletados)
    if (this.coletados >= META_MIMOS) this.vencer()
  }

  // Perde uma vida; na última, acaba a partida
  levarGolpe(estudo) {
    this.vidas -= 1
    this.cb.onVida?.(this.vidas)
    if (this.vidas <= 0) {
      this.bater(estudo)
      return
    }
    this.invencivel = INVENCIVEL_DURACAO
    this.tremor = TREMOR.duracao * 0.7
    this.jogadora.piscar = INVENCIVEL_DURACAO
    this.jogadora.tempoSusto = 0.6
    // o estudo que bateu some numa poeirinha
    estudo.removido = true
    this.particulas.explosao(estudo.x, estudo.y, {
      qtd: 14,
      cores: ['#2E2340', '#B39AA8', '#FFFFFF'],
      vel: [50, 150],
      tamanho: [2, 4],
      vida: [0.4, 0.7],
    })
    this.particulas.texto(this.jogadora.x, CHAO_Y - 92, this.textos.perdeuVida, {
      cor: '#8F1242',
      tamanho: 26,
      vida: 1,
    })
  }

  bater(estudo) {
    this.estado = 'batida'
    this.timerBatida = BATIDA_DURACAO
    this.tremor = TREMOR.duracao
    this.jogadora.surpresa = true
    this.jogadora.piscar = BATIDA_DURACAO
    this.jogadora.vx = 0
    this.particulas.explosao(clamp(estudo.x, this.jogadora.x - 12, this.jogadora.x + 12), CHAO_Y - 50, {
      qtd: 16,
      cores: ['#2E2340', '#B39AA8', '#FF4E8B'],
      vel: [60, 170],
      tamanho: [2, 4],
      vida: [0.4, 0.8],
    })
  }

  vencer() {
    this.estado = 'vitoria'
    this.cb.onVitoria?.({ tempo: this.tempo })
  }

  // --- Desenho ---------------------------------------------------
  desenhar() {
    const ctx = this.ctx
    ctx.setTransform(this.escalaCanvas, 0, 0, this.escalaCanvas, 0, 0)

    if (!this.fundo) {
      this.fundo = ctx.createLinearGradient(0, 0, 0, ALTURA)
      this.fundo.addColorStop(0, CORES.fundoTopo)
      this.fundo.addColorStop(0.65, CORES.fundoBase)
      this.fundo.addColorStop(1, '#FFE0EC')
    }
    ctx.fillStyle = this.fundo
    ctx.fillRect(0, 0, LARGURA, ALTURA)

    if (this.tremor > 0) {
      const f = (this.tremor / TREMOR.duracao) * TREMOR.intensidade
      ctx.translate(aleatorio(-f, f), aleatorio(-f, f))
    }

    this.desenharDecor(ctx)

    // chão bem suave
    ctx.fillStyle = 'rgba(255, 143, 177, 0.18)'
    ctx.fillRect(-10, CHAO_Y + 4, LARGURA + 20, ALTURA - CHAO_Y + 10)

    for (const m of this.mimos) m.desenhar(ctx)
    ctx.globalAlpha = this.opacidadeEstudos
    for (const e of this.estudos) e.desenhar(ctx)
    ctx.globalAlpha = 1

    if (this.brilhoQuase > 0) {
      const a = this.brilhoQuase / 0.5
      const g = ctx.createRadialGradient(this.jogadora.x, CHAO_Y - 40, 4, this.jogadora.x, CHAO_Y - 40, 52)
      g.addColorStop(0, `rgba(255, 214, 230, ${0.9 * a})`)
      g.addColorStop(1, 'rgba(255, 214, 230, 0)')
      ctx.fillStyle = g
      ctx.fillRect(this.jogadora.x - 60, CHAO_Y - 100, 120, 110)
    }

    this.jogadora.desenhar(ctx)
    this.particulas.desenhar(ctx)
  }

  desenharDecor(ctx) {
    ctx.fillStyle = CORES.decor
    for (const d of this.decor) {
      ctx.globalAlpha = 0.28 + Math.sin(d.fase * 1.5) * 0.1
      ctx.save()
      ctx.translate(d.x + Math.sin(d.fase) * 6, d.y)
      if (d.coracao) {
        caminhoCoracao(ctx, d.tamanho)
        ctx.fill()
      } else {
        // brilhinho de 4 pontas
        const s = d.tamanho * 0.6
        ctx.beginPath()
        ctx.moveTo(0, -s)
        ctx.quadraticCurveTo(0, 0, s, 0)
        ctx.quadraticCurveTo(0, 0, 0, s)
        ctx.quadraticCurveTo(0, 0, -s, 0)
        ctx.quadraticCurveTo(0, 0, 0, -s)
        ctx.fill()
      }
      ctx.restore()
    }
    ctx.globalAlpha = 1
  }
}
