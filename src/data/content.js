// ============================================================
//  CONTEÚDO PERSONALIZÁVEL
//  Troque os textos, fotos e músicas aqui. É só editar. 💕
// ============================================================

// --- Textos da tela inicial ---------------------------------
export const intro = {
  eyebrow: "Eu te amo desde que eu te vi, Clara",
  word: 'Isso é só um pouco do que eu sinto por você',
  subtitle:
    'Cada vez que eu te vejo,\nMeu coração começa a bater diferente.',
  cta: "",
  hint: 'To com você para sempre, meu amor, minha gatinha, meu bom dia e minha boa noite.',
}

// --- Contador de dias juntos (tela inicial) -----------------
//  Mesmo formato das datas da viagem: fuso '-03:00' obrigatório.
export const DATA_INICIO_NAMORO = '2026-02-20T00:00:00-03:00'

export const contadorNamoro = {
  acima: 'Juntos há',
  abaixo: 'e contando, pra sempre ❤️',
  desde: 'desde 20 de fevereiro de 2026',
}

// --- Foto surpresa (botão da tela inicial) ------------------
//  As fotos saem da pasta src/fotos-surpresa/ — é só colocar ou tirar
//  arquivos .jpg/.jpeg/.png/.webp de lá, sem mexer em código nenhum.
//  Cuidado para não colocar a mesma foto duas vezes com nomes diferentes.
export const fotosSurpresa = Object.values(
  import.meta.glob('../fotos-surpresa/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)

export const fotoSurpresa = {
  botao: 'Abrir uma foto nossa',
  verso: 'pra você, meu amor',
  outra: 'Outra foto',
  voltar: 'Início',
  voltarRolo: 'Voltar ao rolo',
  rolo: 'Nosso rolo',
  roloTitulo: 'Nosso rolo ❤️',
  acabou: 'Você já abriu todas as nossas fotos... por enquanto ❤️',
  vazio: 'Ainda não tem fotos aqui ❤️',
}

// --- Mensagem que aparece DEPOIS do clique no coração -------
export const reveal = {
  title: 'Você é minha razão de sorrir quando eu acordo\ne minha motivação de dormir pra poder sonhar com você.',
  paragraphs: [
    'Desde o dia em que você chegou, minha vida ficou mais feliz, mais leve, mais viva.',
    'Eu podia escrever um livro inteiro e ainda assim, não ia ser o suficiente para falar o quanto eu te amo.',
    'Eu to aqui por você hoje, ontem, amanhã e para sempre.',
  ],
  signature: 'Para sempre todinho seu',
}

// --- Fotos do carrossel -------------------------------------
//  Arquivos em /public/fotos/  ->  referência como /fotos/nome.jpeg
//  Edite as legendas como quiser. 💕
export const fotos = [
  { src: '/fotos/foto-01.jpeg', legenda: 'A gente 💕' },
  { src: '/fotos/foto-02.jpeg', legenda: 'Você foi a unica coisa que me fez curtir o CIA' },
  { src: '/fotos/foto-03.jpeg', legenda: 'eu te zoar um pouquinho nn da nada' },
  { src: '/fotos/foto-04.jpeg', legenda: 'te amo' },
  { src: '/fotos/foto-05.jpeg', legenda: 'Sorriso da minha vida' },
  { src: '/fotos/foto-06.jpeg', legenda: 'besta' },
  { src: '/fotos/foto-07.jpeg', legenda: 'Melhor viagem da minha vida' },
  { src: '/fotos/foto-08.jpeg', legenda: 'Saudades de você minha gatinha' },
  { src: '/fotos/foto-09.jpeg', legenda: 'Pra você me zoar tambem' },
  { src: '/fotos/foto-10.jpeg', legenda: 'Mas não zoa muito viu' },
  { src: '/fotos/foto-11.jpeg', legenda: 'Te amo, amor' },
  { src: '/fotos/foto-12.jpeg', legenda: 'MUITOOOOOOO' },
  { src: '/fotos/foto-13.jpeg', legenda: 'Mulher da minha vida' },
  { src: '/fotos/foto-14.jpeg', legenda: 'MUITO MESMOOO' },
  { src: '/fotos/foto-15.jpeg', legenda: 'Saudade de você' },
  { src: '/fotos/foto-16.jpeg', legenda: 'MUITA saudade de você' },
  { src: '/fotos/foto-17.jpeg', legenda: 'Pra sempre a gente' },
  { src: '/fotos/foto-18.jpeg', legenda: 'Minha gatinha' },
  { src: '/fotos/foto-19.jpeg', legenda: 'Minha princesa' },
  { src: '/fotos/foto-20.jpeg', legenda: 'Meu amor ❤️' },
]

// Intervalo (ms) de troca automática das fotos
export const FOTO_INTERVALO = 8000

// ============================================================
//  DESPEDIDA TEMPORÁRIA — datas da viagem
//  Para uma próxima viagem, troque SÓ estas duas linhas. 💕
// ============================================================
//  Formato: ISO 8601 COM o fuso escrito no fim ('-03:00' = Brasília).
//  'AAAA-MM-DDTHH:MM:00-03:00'
//
//  O fuso explícito é OBRIGATÓRIO: sem ele a data seria lida no fuso do
//  celular de quem abre o site, e a contagem quebraria em outro fuso.
export const DATA_PARTIDA = '2026-07-16T04:00:00-03:00'
export const DATA_RETORNO = '2026-07-21T12:30:00-03:00'

// Quantidade de cartas (uma por dia). Precisa bater com o tamanho de `cartas`.
export const TOTAL_CARTAS = 5

// --- Textos da seção de despedida ---------------------------
export const despedida = {
  titulo: 'Volto em 5 dias, meu amor ❤️',
  contadorAcima: 'Daqui a...',
  contadorAbaixo: '...to te lambendo todinha ❤️',
  contadorFim: 'To voltando meu amor. Daqui a pouco a gente ta juntinho❤️',
  cartasTitulo: 'Uma cartinha para cada dia ❤️',
  cartaEmBreve: 'Espera mais um pouquinho gatinha 🫶🏻',
  cartaAberta: 'Toque para abrir',
}

// --- As cartinhas (uma liberada por dia) --------------------
//  A carta do Dia N abre em DATA_PARTIDA + (N-1) x 24h.
//  Troque os textos abaixo à vontade — nenhum componente precisa ser tocado.
export const cartas = [
  { dia: 1, texto: 'To com medo da quantidade de saudade que eu vou sentir nessa viagem, meu amor...' },
  { dia: 2, texto: 'Queria do fundo do meu coração que vc tivesse aqui comigo, to com saudades ja e contando os dias pra te ver denovo.' },
  { dia: 3, texto: 'Queria te apresentar todo mundo aqui. Sei que todos vão gostar de vc. Morrendo de saudades' },
  { dia: 4, texto: 'Acabando a viagem meu amor, so mais 2 dias e a gente ta juntinho, morrendo de vontade de te ver... contando as horas' },
  { dia: 5, texto: 'Daqui a pouco a gente ta juntinho amor, vou chegar ai e te dar um beijo na hora que eu te ver. Ansioso p te ver, te beijar, te cheirar, te levar pra sair. Ansioso pra estar com você😘🫶🏻.' },
]

// --- Playlist de fundo --------------------------------------
//  Arquivos em /public/  ->  referência como /nome.mp3
export const playlist = [
  { titulo: 'Maria', artista: 'Matuê', src: '/musica-1-matue-maria.mp3' },
  { titulo: 'Steal My Girl (eu sei q vc gosta dessa)', artista: 'One Direction', src: '/musica-2-steal-my-girl.mp3' },
  { titulo: 'Grapejuice', artista: 'Harry styles', src: '/musica-5-grapejuice.mp3' },
  { titulo: 'Maria do Olho Verde', artista: 'WIU', src: '/musica-3-maria-olho-verde.mp3' },
  { titulo: 'França', artista: '💕', src: '/musica-4.mp3' },
]

// --- Minijogo "Uma mensagem surpresa" -----------------------
//  Mimos = coletáveis (pegar 22 vence) · Estudos = obstáculos.
//  Ajustes de dificuldade ficam em src/jogo/constantes.js.
export const jogo = {
  botaoIntro: 'Uma mensagem surpresa',
  titulo: 'Uma mensagem surpresa',
  frase: 'pegue os mimos para ganhar, evite os estudos!',
  mimos: 'Mimos',
  estudos: 'Estudos',
  meta: 'Pegue 22 mimos',
  vidasInfo: 'Você tem 3 vidas',
  vidas: 'vidas',
  perdeuVida: '-1 vida',
  quase: 'quase!',
  controlesTeclado: 'Use ← → ou A / D para andar',
  controlesToque: 'Arraste o dedo para os lados para andar',
  comecar: 'Começar',
  inicio: 'Início',
  recorde: 'Recorde',
  melhorTempo: 'Melhor tempo',
  pausado: 'Pausado',
  continuar: 'Continuar',
  gameOver: 'Você precisa de um beijo',
  vocePegouAntes: 'Você pegou',
  vocePegouDepois: 'mimos',
  novoRecorde: 'Novo recorde! ❤️',
  jogarDeNovo: 'Jogar de novo',
  // Menu que aparece ao pegar todos os mimos
  vitoria: 'Você conseguiu! ❤️',
  vitoriaTexto: 'Pegou todos os mimos… agora tem uma coisinha te esperando',
  colherRecompensa: 'Colher recompensa',
}

// --- Recompensa (página que abre depois de vencer o jogo) ---
//  O fundo sai da pasta src/fotos-recompensa/ — é só colocar ou tirar
//  arquivos .jpg/.jpeg/.png/.webp de lá, sem mexer em código nenhum.
export const fotosRecompensa = Object.values(
  import.meta.glob('../fotos-recompensa/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)

export const recompensa = {
  titulo: 'Sua recompensa ❤️',
  //  Vídeo em /public/  ->  referência como '/nome.mp4'. Vazio = aviso "em breve".
  video: '/recompensa/video.mp4',
  capa: '/recompensa/capa.jpg', // imagem mostrada antes de dar play
  videoEmBreve: 'O vídeo vai aparecer aqui 🎬',
  mensagem:
    'Clara, feliz aniversário, estou gravando esse vídeo só para tentar falar o quanto eu tenho orgulho de você.  Eu sei que não consigo em palavras, então decidir tentar em libras. Desde o nosso primeiro date eu sou apaixonado por você, você é a razão do meu acordar e o meu pensamento antes do dormir. Quero que esse seja o primeiro de infinitos aniversários juntos.  Eu te amo',
  voltar: 'Início',
}
