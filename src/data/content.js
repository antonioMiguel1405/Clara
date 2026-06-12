// ============================================================
//  CONTEÚDO PERSONALIZÁVEL
//  Troque os textos, fotos e músicas aqui. É só editar. 💕
// ============================================================

// --- Textos da tela inicial ---------------------------------
export const intro = {
  eyebrow: "Eu te amo desde o dia que eu te vi, Clara",
  word: 'Isso é só um pouco do que eu sinto por você',
  subtitle:
    'Cada vez que eu te vejo,\nMeu coração começa a bater diferente.',
  cta: "",
  hint: 'To com você para sempre, meu amor, minha gatinha, meu bom dia e minha boa noite.',
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

// --- Playlist de fundo --------------------------------------
//  Arquivos em /public/  ->  referência como /nome.mp3
export const playlist = [
  { titulo: 'Maria', artista: 'Matuê', src: '/musica-1-matue-maria.mp3' },
  { titulo: 'Steal My Girl (eu sei q vc gosta dessa)', artista: 'One Direction', src: '/musica-2-steal-my-girl.mp3' },
  { titulo: 'Grapejuice', artista: 'Harry styles', src: '/musica-5-grapejuice.mp3' },
  { titulo: 'Maria do Olho Verde', artista: 'WIU', src: '/musica-3-maria-olho-verde.mp3' },
  { titulo: 'França', artista: '💕', src: '/musica-4.mp3' },
]
