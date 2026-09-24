// ============================================================
//  DESENHOS — tudo feito com formas no canvas, sem imagens.
//  Cada função desenha centrada na origem (a Clara: origem nos pés);
//  quem chama faz o translate antes.
// ============================================================

// --- Aparência da Clara (ajuste à vontade) ------------------
//  Inspirada numa foto dela: cabelo castanho-escuro longo e ondulado,
//  repartido no meio; óculos de armação fina; brinquinho dourado;
//  moletom azul-marinho de faculdade e calça bege — com o jaleco por cima.
const CLARA = {
  pele: '#F2C6A4',
  peleContorno: '#D39C7B',
  cabelo: '#3A2419',
  cabeloPontas: '#5E3B27', // as pontas puxam para um castanho mais claro
  cabeloBrilho: '#7A5038',
  moletom: '#1F2A4D',
  moletomEscuro: '#141B35',
  estampa: 'rgba(255, 255, 255, 0.85)',
  jaleco: '#FFFFFF',
  jalecoContorno: '#B39AA8',
  calca: '#C4A57F',
  tenis: '#E0457B',
  oculos: '#5B5560',
  sobrancelha: '#3A2419',
  olhos: '#2B1B14',
  boca: '#B5485F',
  bochecha: 'rgba(255, 110, 150, 0.3)',
  brinco: '#D4A437',
  dentinho: '#7FB8E6',
  // Proporções (px, relativas aos pés)
  cabecaY: -66,
  cabecaR: 9.5,
  ombroY: -55,
  quadrilY: -29,
  cabeloBase: -36, // longo, passando dos ombros
}

const TRACO_PERIGO = '#2E2340'

function retanguloArredondado(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// Escurece uma cor #RRGGBB
function escurecer(hex, fator = 0.7) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.round(((n >> 16) & 255) * fator)
  const g = Math.round(((n >> 8) & 255) * fator)
  const b = Math.round((n & 255) * fator)
  return `rgb(${r},${g},${b})`
}

export function caminhoCoracao(ctx, largura) {
  const w = largura
  const h = largura * 0.9
  ctx.beginPath()
  ctx.moveTo(0, 0.5 * h)
  ctx.bezierCurveTo(-0.15 * w, 0.35 * h, -0.5 * w, 0.15 * h, -0.5 * w, -0.15 * h)
  ctx.bezierCurveTo(-0.5 * w, -0.42 * h, -0.2 * w, -0.55 * h, 0, -0.3 * h)
  ctx.bezierCurveTo(0.2 * w, -0.55 * h, 0.5 * w, -0.42 * h, 0.5 * w, -0.15 * h)
  ctx.bezierCurveTo(0.5 * w, 0.15 * h, 0.15 * w, 0.35 * h, 0, 0.5 * h)
  ctx.closePath()
}

// ============================================================
//  CLARA — estudante de odontologia, alta e magra, de óculos,
//  cabelo moreno longo e ondulado, moletom e jaleco branco.
// ============================================================

// Degradê do cabelo: escuro na raiz, castanho mais claro nas pontas
function tintaCabelo(ctx, y0, y1) {
  const g = ctx.createLinearGradient(0, y0, 0, y1)
  g.addColorStop(0, CLARA.cabelo)
  g.addColorStop(0.55, CLARA.cabelo)
  g.addColorStop(1, CLARA.cabeloPontas)
  return g
}

// Volume de trás, ondulado e mais largo nas pontas. `desvio` empurra as
// pontas para o lado (o cabelo acompanha o movimento com atraso).
function cabeloTras(ctx, desvio) {
  const topo = CLARA.cabecaY
  const base = CLARA.cabeloBase
  const k = (y) => (y - topo) / (base - topo)
  const lag = (y) => k(y) ** 1.3 * desvio
  const largura = (y) => 11.5 + k(y) * 4
  const n = 5
  const seg = (base - topo) / n

  ctx.beginPath()
  ctx.moveTo(-11.5, topo)
  // lado esquerdo, descendo em ondas
  for (let i = 0; i < n; i++) {
    const ym = topo + seg * (i + 0.5)
    const y1 = topo + seg * (i + 1)
    const bojo = i % 2 === 0 ? -3.5 : 1.5
    ctx.quadraticCurveTo(-largura(ym) + bojo + lag(ym), ym, -largura(y1) + lag(y1), y1)
  }
  // pontas onduladas
  const m = 5
  const w = largura(base)
  for (let i = 0; i < m; i++) {
    const x0 = -w + ((2 * w) / m) * i
    const x1 = -w + ((2 * w) / m) * (i + 1)
    ctx.quadraticCurveTo((x0 + x1) / 2 + lag(base), base + 5, x1 + lag(base), base)
  }
  // lado direito, subindo
  for (let i = n - 1; i >= 0; i--) {
    const ym = topo + seg * (i + 0.5)
    const y0 = topo + seg * i
    const bojo = i % 2 === 0 ? 3.5 : -1.5
    ctx.quadraticCurveTo(largura(ym) + bojo + lag(ym), ym, largura(y0) + lag(y0), y0)
  }
  ctx.arc(0, topo, 11.5, 0, Math.PI, true)
  ctx.closePath()
  ctx.fillStyle = tintaCabelo(ctx, topo, base + 4)
  ctx.fill()

  // brilho das ondas
  ctx.strokeStyle = CLARA.cabeloBrilho
  ctx.lineWidth = 1.1
  ctx.beginPath()
  for (const lado of [-1, 1]) {
    for (const y of [topo + 9, topo + 20]) {
      const x = lado * (largura(y) - 2.5)
      ctx.moveTo(x + lag(y), y)
      ctx.quadraticCurveTo(x + lado * 2.5 + lag(y + 4), y + 4, x + lag(y + 8), y + 8)
    }
  }
  ctx.stroke()
}

// Mecha ondulada que desce da têmpora e cai por cima do ombro
function mechaFrente(ctx, lado, fim, desvio) {
  const ini = CLARA.cabecaY - 3
  const k = (y) => (y - ini) / (fim - ini)
  const lag = (y) => k(y) * desvio * 0.7
  const fora = (y) => lado * (10.8 + k(y) * 2)
  const dentro = (y) => lado * (7.6 + k(y) * 1.5)
  const n = 4
  const seg = (fim - ini) / n

  ctx.beginPath()
  ctx.moveTo(fora(ini), ini)
  for (let i = 0; i < n; i++) {
    const ym = ini + seg * (i + 0.5)
    const y1 = ini + seg * (i + 1)
    const bojo = lado * (i % 2 === 0 ? 2.2 : -1)
    ctx.quadraticCurveTo(fora(ym) + bojo + lag(ym), ym, fora(y1) + lag(y1), y1)
  }
  ctx.quadraticCurveTo((fora(fim) + dentro(fim)) / 2 + lag(fim), fim + 3, dentro(fim) + lag(fim), fim)
  for (let i = n - 1; i >= 0; i--) {
    const ym = ini + seg * (i + 0.5)
    const y0 = ini + seg * i
    const bojo = lado * (i % 2 === 0 ? 1.4 : -1.6)
    ctx.quadraticCurveTo(dentro(ym) + bojo + lag(ym), ym, dentro(y0) + lag(y0), y0)
  }
  ctx.closePath()
  ctx.fillStyle = tintaCabelo(ctx, ini, fim + 3)
  ctx.fill()
}

// Topo repartido no meio (sem franja) e mechas emoldurando o rosto
function cabeloFrente(ctx, desvio) {
  const cy = CLARA.cabecaY
  ctx.fillStyle = CLARA.cabelo
  ctx.beginPath()
  ctx.moveTo(-10.4, cy + 1)
  ctx.arc(0, cy, 10.4, Math.PI * 1.03, Math.PI * 1.97)
  ctx.lineTo(10.4, cy + 1)
  ctx.quadraticCurveTo(8.5, cy - 5.5, 0.6, cy - 6.8)
  ctx.lineTo(-0.6, cy - 6.8)
  ctx.quadraticCurveTo(-8.5, cy - 5.5, -10.4, cy + 1)
  ctx.closePath()
  ctx.fill()
  // risca do meio
  ctx.strokeStyle = CLARA.cabeloBrilho
  ctx.lineWidth = 0.7
  ctx.beginPath()
  ctx.moveTo(0, cy - 10.2)
  ctx.lineTo(0, cy - 7)
  ctx.stroke()

  // uma mecha longa sobre o ombro e outra mais curta, como na foto
  mechaFrente(ctx, -1, CLARA.cabeloBase + 1, desvio)
  mechaFrente(ctx, 1, CLARA.ombroY + 6, desvio)
}

function rosto(ctx, surpresa) {
  const cy = CLARA.cabecaY
  // bochechas
  ctx.fillStyle = CLARA.bochecha
  ctx.beginPath()
  ctx.ellipse(-5.6, cy + 3.4, 1.8, 1.1, 0, 0, Math.PI * 2)
  ctx.ellipse(5.6, cy + 3.4, 1.8, 1.1, 0, 0, Math.PI * 2)
  ctx.fill()

  // sobrancelhas marcadas (sobem no susto)
  ctx.strokeStyle = CLARA.sobrancelha
  ctx.lineWidth = 1.1
  ctx.lineCap = 'round'
  const arco = surpresa ? 1.6 : 0.8
  ctx.beginPath()
  for (const lado of [-1, 1]) {
    ctx.moveTo(lado * 6.2, cy - 3.4)
    ctx.quadraticCurveTo(lado * 4.2, cy - 4 - arco, lado * 1.9, cy - 3.9 - (surpresa ? 0.8 : 0))
  }
  ctx.stroke()

  // olhos
  ctx.fillStyle = CLARA.olhos
  const r = surpresa ? 1.45 : 1.1
  ctx.beginPath()
  ctx.arc(-3.9, cy + 0.5, r, 0, Math.PI * 2)
  ctx.arc(3.9, cy + 0.5, r, 0, Math.PI * 2)
  ctx.fill()

  // boca
  if (surpresa) {
    ctx.beginPath()
    ctx.ellipse(0, cy + 5.2, 1.3, 1.6, 0, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.strokeStyle = CLARA.boca
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(0, cy + 3.6, 2.2, Math.PI * 0.18, Math.PI * 0.82)
    ctx.stroke()
  }

  // óculos de armação fina, retangulares com cantos arredondados
  ctx.strokeStyle = CLARA.oculos
  ctx.lineWidth = 0.75
  ctx.fillStyle = 'rgba(205, 215, 235, 0.32)'
  for (const lado of [-1, 1]) {
    retanguloArredondado(ctx, lado * 3.9 - 3.3, cy - 2.1, 6.6, 5.2, 1.9)
    ctx.fill()
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.moveTo(-0.6, cy - 0.4)
  ctx.quadraticCurveTo(0, cy - 1.3, 0.6, cy - 0.4)
  ctx.moveTo(-7.2, cy - 1)
  ctx.lineTo(-9.6, cy - 1.5)
  ctx.moveTo(7.2, cy - 1)
  ctx.lineTo(9.6, cy - 1.5)
  ctx.stroke()
  // reflexo
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  for (const lado of [-1, 1]) {
    ctx.moveTo(lado * 3.9 + 0.6, cy - 1.2)
    ctx.lineTo(lado * 3.9 + 2, cy + 0.4)
  }
  ctx.stroke()
}

// Brinquinho dourado de argola
function brincos(ctx) {
  ctx.strokeStyle = CLARA.brinco
  ctx.lineWidth = 0.7
  ctx.beginPath()
  for (const lado of [-1, 1]) {
    ctx.moveTo(lado * 9.7 + 0.8, CLARA.cabecaY + 4.4)
    ctx.arc(lado * 9.7, CLARA.cabecaY + 4.4, 0.8, 0, Math.PI * 2)
  }
  ctx.stroke()
}

// Mangas do jaleco, com o punho do moletom aparecendo e a mão na ponta
function braco(ctx, lado, balanco) {
  const x0 = lado * 10.5
  const y0 = CLARA.ombroY + 1.5
  const x1 = lado * 12.5 + balanco
  const y1 = -33
  ctx.lineCap = 'round'
  ctx.strokeStyle = CLARA.jalecoContorno
  ctx.lineWidth = 6.4
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
  ctx.strokeStyle = CLARA.jaleco
  ctx.lineWidth = 4.4
  ctx.stroke()
  ctx.fillStyle = CLARA.moletom
  retanguloArredondado(ctx, x1 - 2.1, y1 - 0.2, 4.2, 2.3, 0.8)
  ctx.fill()
  ctx.fillStyle = CLARA.pele
  ctx.beginPath()
  ctx.arc(x1, y1 + 3.8, 2.1, 0, Math.PI * 2)
  ctx.fill()
}

// Moletom azul-marinho de faculdade, com a estampa branca no peito
function moletom(ctx) {
  const topo = CLARA.ombroY - 1
  ctx.fillStyle = CLARA.moletom
  retanguloArredondado(ctx, -7.5, topo, 15, CLARA.quadrilY - topo + 4, 3)
  ctx.fill()
  // barra e gola careca
  ctx.fillStyle = CLARA.moletomEscuro
  ctx.fillRect(-7.5, CLARA.quadrilY + 1, 15, 2)
  ctx.strokeStyle = CLARA.moletomEscuro
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.arc(0, topo - 0.6, 2.7, Math.PI * 0.1, Math.PI * 0.9)
  ctx.stroke()
  // estampa: letreiro e brasão
  ctx.fillStyle = CLARA.estampa
  ctx.fillRect(-2.6, -50.4, 5.2, 0.8)
  ctx.fillRect(-2.2, -48.9, 4.4, 0.7)
  ctx.fillRect(-2.4, -42.9, 4.8, 0.6)
  ctx.strokeStyle = CLARA.estampa
  ctx.lineWidth = 0.6
  ctx.beginPath()
  ctx.arc(0, -45.8, 1.5, 0, Math.PI * 2)
  ctx.stroke()
}

/**
 * Desenha a Clara com os pés na origem.
 * @param {object} o
 * @param {number} o.andar     fase da caminhada (radianos)
 * @param {number} o.movimento 0..1, quanto ela está andando
 * @param {number} o.desvioCabelo deslocamento das pontas do cabelo (px)
 * @param {boolean} o.surpresa  expressão de susto
 */
export function desenharClara(ctx, { andar = 0, movimento = 0, desvioCabelo = 0, surpresa = false } = {}) {
  const passo = Math.sin(andar) * 3.2 * movimento
  const balanco = Math.sin(andar) * 1.6 * movimento

  cabeloTras(ctx, desvioCabelo)

  // pernas compridas, calça bege
  ctx.lineCap = 'round'
  ctx.strokeStyle = CLARA.calca
  ctx.lineWidth = 4.8
  ctx.beginPath()
  ctx.moveTo(-3.4, CLARA.quadrilY)
  ctx.lineTo(-3.4 + passo, -3)
  ctx.moveTo(3.4, CLARA.quadrilY)
  ctx.lineTo(3.4 - passo, -3)
  ctx.stroke()
  // tênis
  ctx.fillStyle = CLARA.tenis
  ctx.beginPath()
  ctx.ellipse(-4 + passo, -1.4, 3.4, 1.9, 0, 0, Math.PI * 2)
  ctx.ellipse(4 - passo, -1.4, 3.4, 1.9, 0, 0, Math.PI * 2)
  ctx.fill()

  moletom(ctx)

  // jaleco aberto: duas abas brancas com contorno, deixando o moletom à mostra
  ctx.fillStyle = CLARA.jaleco
  ctx.strokeStyle = CLARA.jalecoContorno
  ctx.lineWidth = 1.1
  for (const lado of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(lado * 3.2, CLARA.ombroY - 1.5)
    ctx.lineTo(lado * 10.5, CLARA.ombroY)
    ctx.lineTo(lado * 12.5, -21)
    ctx.lineTo(lado * 5.2, -21)
    ctx.lineTo(lado * 4.6, -40)
    ctx.lineTo(lado * 2.9, CLARA.ombroY + 5)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
  // bolso com um dentinho bordado
  ctx.strokeStyle = CLARA.jalecoContorno
  ctx.lineWidth = 0.8
  ctx.strokeRect(-10.2, -47, 5, 4.2)
  ctx.fillStyle = CLARA.dentinho
  ctx.beginPath()
  ctx.moveTo(-9.4, -46.2)
  ctx.quadraticCurveTo(-7.7, -47.2, -6, -46.2)
  ctx.lineTo(-6.4, -43.6)
  ctx.lineTo(-7.2, -44.8)
  ctx.lineTo(-8.2, -44.8)
  ctx.lineTo(-9, -43.6)
  ctx.closePath()
  ctx.fill()

  braco(ctx, -1, -balanco)
  braco(ctx, 1, balanco)

  // pescoço e cabeça
  ctx.fillStyle = CLARA.pele
  ctx.fillRect(-2, CLARA.cabecaY + 7, 4, 5)
  ctx.beginPath()
  ctx.arc(0, CLARA.cabecaY, CLARA.cabecaR, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = CLARA.peleContorno
  ctx.lineWidth = 0.8
  ctx.stroke()

  rosto(ctx, surpresa)
  cabeloFrente(ctx, desvioCabelo)
  brincos(ctx)
}

// ============================================================
//  ESTUDOS (obstáculos) — contorno escuro e cores que contrastam
//  com o rosa, para terem cara de "perigo".
// ============================================================

export function desenharLivro(ctx, { largura = 44, altura = 34, cor = '#3F6CB5' } = {}) {
  const w = largura
  const h = altura
  const x = -w / 2
  const y = -h / 2
  // páginas aparecendo na lateral e embaixo
  ctx.fillStyle = '#FFF6E0'
  retanguloArredondado(ctx, x + 3, y + 3, w - 2, h - 2, 3)
  ctx.fill()
  ctx.strokeStyle = TRACO_PERIGO
  ctx.lineWidth = 1.6
  ctx.stroke()
  ctx.strokeStyle = '#D8C9A6'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  for (let i = 1; i <= 2; i++) {
    ctx.moveTo(x + w - 2 + i * 0.1, y + 4 + i * 2)
    ctx.lineTo(x + w - 2 + i * 0.1, y + h - 2)
  }
  ctx.stroke()

  // capa
  ctx.fillStyle = cor
  retanguloArredondado(ctx, x, y, w - 2, h - 2, 3)
  ctx.fill()
  ctx.strokeStyle = TRACO_PERIGO
  ctx.lineWidth = 2
  ctx.stroke()
  // lombada
  ctx.fillStyle = escurecer(cor, 0.72)
  ctx.fillRect(x + 1, y + 1, w * 0.16, h - 4)
  // título
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  retanguloArredondado(ctx, x + w * 0.3, y + h * 0.22, w * 0.52, h * 0.16, 1.5)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillRect(x + w * 0.36, y + h * 0.5, w * 0.4, h * 0.07)
}

export function desenharDentadura(ctx, { largura = 36, altura = 30, abertura = 0 } = {}) {
  const w = largura
  const h = altura
  const abre = abertura * 3.2
  const gengiva = '#B2334F'
  const gengivaContorno = '#5C1227'

  // boca por dentro (aparece quando abre)
  ctx.fillStyle = '#4A0E1F'
  retanguloArredondado(ctx, -w * 0.42, -abre - 2, w * 0.84, abre * 2 + 4, 3)
  ctx.fill()

  for (const lado of [-1, 1]) {
    const desloc = lado * abre
    // gengiva
    ctx.fillStyle = gengiva
    ctx.strokeStyle = gengivaContorno
    ctx.lineWidth = 1.6
    ctx.beginPath()
    const yExt = lado * (h / 2) + desloc
    const yInt = lado * 1 + desloc
    ctx.moveTo(-w / 2, yInt)
    ctx.quadraticCurveTo(-w / 2, yExt, 0, yExt)
    ctx.quadraticCurveTo(w / 2, yExt, w / 2, yInt)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // dentes
    const n = 6
    const dw = (w * 0.8) / n
    ctx.fillStyle = '#FFFFFF'
    ctx.strokeStyle = '#8A7F86'
    ctx.lineWidth = 0.8
    for (let i = 0; i < n; i++) {
      const dx = -w * 0.4 + i * dw
      const alt = h * (i === 0 || i === n - 1 ? 0.2 : 0.26)
      const y0 = lado < 0 ? desloc - alt : desloc
      retanguloArredondado(ctx, dx + 0.4, y0, dw - 0.8, alt, 1.4)
      ctx.fill()
      ctx.stroke()
    }
  }
}

export function desenharProfessor(ctx, { largura = 58, altura = 78 } = {}) {
  // desenhado em 58 x 78 e escalado para o tamanho pedido
  ctx.save()
  ctx.scale(largura / 58, altura / 78)

  // pernas
  ctx.fillStyle = '#2A2F3F'
  ctx.fillRect(-9, 26, 7, 12)
  ctx.fillRect(2, 26, 7, 12)
  ctx.fillStyle = '#1A1A22'
  ctx.beginPath()
  ctx.ellipse(-6, 38, 5, 2.4, 0, 0, Math.PI * 2)
  ctx.ellipse(6, 38, 5, 2.4, 0, 0, Math.PI * 2)
  ctx.fill()

  // terno
  ctx.fillStyle = '#3B4A66'
  ctx.strokeStyle = TRACO_PERIGO
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-15, -10)
  ctx.lineTo(15, -10)
  ctx.lineTo(19, 28)
  ctx.lineTo(-19, 28)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  // camisa e gravata
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.moveTo(-6, -10)
  ctx.lineTo(6, -10)
  ctx.lineTo(0, 6)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#9C2B3A'
  ctx.beginPath()
  ctx.moveTo(-2, -9)
  ctx.lineTo(2, -9)
  ctx.lineTo(3, 6)
  ctx.lineTo(0, 10)
  ctx.lineTo(-3, 6)
  ctx.closePath()
  ctx.fill()

  // braço esquerdo, e o direito segurando a régua
  ctx.strokeStyle = '#3B4A66'
  ctx.lineCap = 'round'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(-15, -6)
  ctx.lineTo(-20, 16)
  ctx.moveTo(15, -6)
  ctx.lineTo(22, 4)
  ctx.stroke()
  ctx.save()
  ctx.translate(23, 4)
  ctx.rotate(-0.35)
  ctx.fillStyle = '#E8B931'
  ctx.strokeStyle = TRACO_PERIGO
  ctx.lineWidth = 1.2
  ctx.fillRect(-2.5, -26, 5, 30)
  ctx.strokeRect(-2.5, -26, 5, 30)
  ctx.strokeStyle = '#8A6A10'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    ctx.moveTo(-2.5, -22 + i * 4.5)
    ctx.lineTo(0, -22 + i * 4.5)
  }
  ctx.stroke()
  ctx.restore()
  ctx.fillStyle = '#F1C6A0'
  ctx.beginPath()
  ctx.arc(-20, 18, 3, 0, Math.PI * 2)
  ctx.arc(23, 5, 3, 0, Math.PI * 2)
  ctx.fill()

  // cabeça careca com cabelo grisalho dos lados
  ctx.fillStyle = '#F1C6A0'
  ctx.strokeStyle = TRACO_PERIGO
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.arc(0, -24, 13, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#A7A7AE'
  for (const lado of [-1, 1]) {
    ctx.beginPath()
    ctx.ellipse(lado * 12, -24, 3.6, 6, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  // brilho na careca
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.beginPath()
  ctx.ellipse(-4, -33, 4, 1.8, -0.3, 0, Math.PI * 2)
  ctx.fill()
  // sobrancelhas bravas
  ctx.strokeStyle = '#555'
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(-8, -29)
  ctx.lineTo(-2, -27)
  ctx.moveTo(8, -29)
  ctx.lineTo(2, -27)
  ctx.stroke()
  // óculos quadrados
  ctx.strokeStyle = '#222'
  ctx.lineWidth = 1.3
  ctx.strokeRect(-9, -26, 7, 5)
  ctx.strokeRect(2, -26, 7, 5)
  ctx.beginPath()
  ctx.moveTo(-2, -24)
  ctx.lineTo(2, -24)
  ctx.stroke()
  ctx.fillStyle = '#222'
  ctx.beginPath()
  ctx.arc(-5.5, -23.5, 1, 0, Math.PI * 2)
  ctx.arc(5.5, -23.5, 1, 0, Math.PI * 2)
  ctx.fill()
  // bigode
  ctx.fillStyle = '#8E8E96'
  ctx.beginPath()
  ctx.ellipse(-3, -17, 4, 2, 0.2, 0, Math.PI * 2)
  ctx.ellipse(3, -17, 4, 2, -0.2, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

// ============================================================
//  MIMOS (coletáveis)
// ============================================================

// Brilho suave atrás dos mimos, para parecerem algo "bom"
export function desenharAura(ctx, raio, t = 0) {
  const r = raio * (1 + Math.sin(t * 4) * 0.08)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
  g.addColorStop(0, 'rgba(255,255,255,0.95)')
  g.addColorStop(0.5, 'rgba(255,214,230,0.55)')
  g.addColorStop(1, 'rgba(255,182,206,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fill()
}

// Batida dupla como o `heartbeat` do site
function batida(t) {
  const f = (t % 1.6) / 1.6
  if (f < 0.15) return Math.sin((f / 0.15) * Math.PI) * 0.14
  if (f > 0.3 && f < 0.45) return Math.sin(((f - 0.3) / 0.15) * Math.PI) * 0.09
  return 0
}

export function desenharCoracao(ctx, { tamanho = 30, t = 0 } = {}) {
  const esc = 1 + batida(t)
  ctx.save()
  ctx.scale(esc, esc)
  caminhoCoracao(ctx, tamanho)
  ctx.fillStyle = '#E0182D'
  ctx.fill()
  ctx.strokeStyle = '#8E0C1C'
  ctx.lineWidth = 1.4
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.beginPath()
  ctx.ellipse(-tamanho * 0.22, -tamanho * 0.16, tamanho * 0.09, tamanho * 0.05, -0.6, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export function desenharBeijo(ctx, { tamanho = 32 } = {}) {
  const s = tamanho
  const cor = '#E8336E'
  const contorno = '#8F1242'
  ctx.lineJoin = 'round'
  // lábio de cima (dois montinhos)
  ctx.beginPath()
  ctx.moveTo(-0.5 * s, 0.02 * s)
  ctx.bezierCurveTo(-0.38 * s, -0.12 * s, -0.3 * s, -0.3 * s, -0.16 * s, -0.28 * s)
  ctx.quadraticCurveTo(-0.06 * s, -0.27 * s, 0, -0.16 * s)
  ctx.quadraticCurveTo(0.06 * s, -0.27 * s, 0.16 * s, -0.28 * s)
  ctx.bezierCurveTo(0.3 * s, -0.3 * s, 0.38 * s, -0.12 * s, 0.5 * s, 0.02 * s)
  ctx.quadraticCurveTo(0, -0.04 * s, -0.5 * s, 0.02 * s)
  ctx.closePath()
  ctx.fillStyle = cor
  ctx.fill()
  ctx.strokeStyle = contorno
  ctx.lineWidth = 1.3
  ctx.stroke()
  // lábio de baixo
  ctx.beginPath()
  ctx.moveTo(-0.5 * s, 0.04 * s)
  ctx.quadraticCurveTo(0, 0.02 * s, 0.5 * s, 0.04 * s)
  ctx.bezierCurveTo(0.36 * s, 0.3 * s, 0.14 * s, 0.36 * s, 0, 0.36 * s)
  ctx.bezierCurveTo(-0.14 * s, 0.36 * s, -0.36 * s, 0.3 * s, -0.5 * s, 0.04 * s)
  ctx.closePath()
  ctx.fillStyle = cor
  ctx.fill()
  ctx.stroke()
  // linha da boca e brilho
  ctx.strokeStyle = contorno
  ctx.lineWidth = 1.1
  ctx.beginPath()
  ctx.moveTo(-0.42 * s, 0.03 * s)
  ctx.quadraticCurveTo(0, 0.08 * s, 0.42 * s, 0.03 * s)
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.65)'
  ctx.beginPath()
  ctx.ellipse(0.12 * s, 0.2 * s, 0.1 * s, 0.035 * s, -0.15, 0, Math.PI * 2)
  ctx.fill()
}

export function desenharSushi(ctx, { tamanho = 32 } = {}) {
  const s = tamanho
  // arroz
  ctx.fillStyle = '#FFFDF7'
  ctx.strokeStyle = '#B9A796'
  ctx.lineWidth = 1.2
  retanguloArredondado(ctx, -0.44 * s, -0.08 * s, 0.88 * s, 0.4 * s, 0.14 * s)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#E9DFD2'
  for (const [gx, gy] of [[-0.28, 0.18], [-0.1, 0.24], [0.2, 0.2], [0.3, 0.1]]) {
    ctx.beginPath()
    ctx.ellipse(gx * s, gy * s, 0.035 * s, 0.02 * s, 0.4, 0, Math.PI * 2)
    ctx.fill()
  }
  // salmão
  ctx.fillStyle = '#FF8A5B'
  ctx.strokeStyle = '#C8552E'
  ctx.beginPath()
  ctx.moveTo(-0.5 * s, 0.02 * s)
  ctx.quadraticCurveTo(-0.52 * s, -0.24 * s, -0.2 * s, -0.26 * s)
  ctx.lineTo(0.3 * s, -0.26 * s)
  ctx.quadraticCurveTo(0.54 * s, -0.24 * s, 0.5 * s, 0.02 * s)
  ctx.quadraticCurveTo(0, -0.06 * s, -0.5 * s, 0.02 * s)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  // listras do salmão
  ctx.strokeStyle = '#FFD6C4'
  ctx.lineWidth = 1.3
  ctx.beginPath()
  for (const lx of [-0.28, -0.08, 0.12, 0.32]) {
    ctx.moveTo((lx - 0.06) * s, -0.2 * s)
    ctx.quadraticCurveTo((lx + 0.04) * s, -0.12 * s, (lx - 0.02) * s, -0.04 * s)
  }
  ctx.stroke()
  // faixa de nori
  ctx.fillStyle = '#24372D'
  ctx.fillRect(-0.09 * s, -0.27 * s, 0.18 * s, 0.6 * s)
}

// Tabelas usadas pelas classes e pelos mini-desenhos da tela inicial
export const DESENHAR_ESTUDO = {
  livro: desenharLivro,
  dentadura: desenharDentadura,
  professor: desenharProfessor,
}

export const DESENHAR_MIMO = {
  coracao: desenharCoracao,
  beijo: desenharBeijo,
  sushi: desenharSushi,
}
