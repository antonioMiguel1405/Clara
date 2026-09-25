// ============================================================
//  CONSTANTES DO JOGO
//  Tudo o que dá para calibrar (tamanhos, velocidades, dificuldade)
//  mora aqui. Velocidades em px/s e tempos em segundos, sempre no
//  mundo lógico de LARGURA x ALTURA (o canvas é escalado por cima).
// ============================================================

export const LARGURA = 400
export const ALTURA = 700

// Mimos necessários para vencer
export const META_MIMOS = 22

// Vidas por partida e quanto tempo ela fica piscando (atravessando
// estudos) depois de levar um golpe
export const VIDAS = 3
export const INVENCIVEL_DURACAO = 1.6

// --- Clara ---------------------------------------------------
export const CHAO_Y = 674 // y dos pés

export const JOGADORA = {
  velMax: 430, // teclado
  acel: 2800,
  atrito: 3200,
  velMaxToque: 620, // arrastando o dedo
  rigidezToque: 13,
  margem: 17, // não sai da tela (conta o cabelo)
  // Hitbox relativa aos pés: só cabeça + corpo (cabelo e jaleco aberto não contam)
  cabecaY: -66,
  cabecaR: 8,
  corpoMeiaLargura: 7,
  corpoTopo: -57,
}

// Faixa vertical ocupada pela hitbox da Clara
export const FAIXA_TOPO = CHAO_Y + JOGADORA.cabecaY - JOGADORA.cabecaR

// --- Estudos (obstáculos) -----------------------------------
//  hit* = hitbox justa, um pouco menor que o desenho.
export const ESTUDOS = {
  livro: { largura: 44, altura: 34, hitLargura: 37, hitAltura: 27, velocidade: 200 },
  dentadura: { largura: 36, altura: 30, hitLargura: 29, hitAltura: 23, velocidade: 300 },
  professor: { largura: 58, altura: 78, hitLargura: 44, hitAltura: 68, velocidade: 145 },
}

export const CORES_LIVRO = ['#3F6CB5', '#2F8F7A', '#7B4BB0', '#D9692E', '#4F5D75']

// --- Mimos (coletáveis) -------------------------------------
export const MIMOS = {
  coracao: { valor: 1, tamanho: 30 },
  beijo: { valor: 1, tamanho: 32 },
  sushi: { valor: 1, tamanho: 32 },
}
export const MIMO_RAIO_COLETA = 22 // generoso, maior que o desenho
export const MIMO_VELOCIDADE = 165
export const MIMO_INTERVALO = [2.2, 2.9] // s entre um mimo e outro (sorteado)
export const MIMO_DESVIO_CAMINHO = 16 // quanto o mimo pode fugir do caminho seguro

// --- Caminho seguro -----------------------------------------
//  Uma linha invisível que passeia pela tela devagar (bem mais devagar
//  que a Clara). Nenhum estudo pode ocupá-la quando chega na altura
//  dela, então sempre existe uma saída alcançável.
export const CAMINHO = {
  velMax: 185,
  meiaLargura: 30,
  passo: [0.6, 1.4], // s entre dois pontos do caminho
  margemX: 36,
  horizonte: 8, // s de caminho gerados à frente
}

// --- Dificuldade --------------------------------------------
//  d vai de 0 a 1. Cada par [a, b] é interpolado entre d = 0 e d = 1.
export const DIFICULDADE = {
  tempoMax: 150, // em quantos segundos o tempo sozinho chega na sua parte máxima
  pesoTempo: 0.5,
  pesoMimos: 0.5,
  // Reta final: um empurrão extra, suave, entre essas frações da meta
  retaFinalInicio: 0.78,
  retaFinalFim: 0.94,
  retaFinalBonus: 0.15,
  teto: 1,
  suavizacao: 1.2, // quão rápido a dificuldade atual persegue a desejada (1/s)

  velocidadeMult: [1, 1.75],
  intervaloEstudo: [1.05, 0.42],
  chanceDuplo: [0.1, 0.42],
  chanceTriplo: [0, 0.16],
  primeiraBarreira: 9,
  intervaloBarreira: [10, 5.5],
  vaoBarreira: [124, 90],
  pesoTipos: {
    livro: [0.55, 0.45],
    dentadura: [0.2, 0.33],
    professor: [0.25, 0.22],
  },
}

// --- Efeitos -------------------------------------------------
export const QUASE = { distancia: 11, intervaloMin: 0.7 }
export const BATIDA_DURACAO = 0.9
export const TREMOR = { duracao: 0.35, intensidade: 6 }
export const DELTA_MAX = 0.05

export const CORES = {
  fundoTopo: '#FFE4EF',
  fundoBase: '#FFF0F5',
  rosaMid: '#FF8FB1',
  rosaDeep: '#FF4E8B',
  decor: '#FFB6CE',
}

// Interpola um par [a, b] pela dificuldade d (0..1)
export const lerp = ([a, b], d) => a + (b - a) * d
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
export const aleatorio = (a, b) => a + Math.random() * (b - a)
