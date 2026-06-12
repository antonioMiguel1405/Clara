// ============================================================
//  CONTEÚDO PERSONALIZÁVEL
//  Troque os textos, fotos e músicas aqui. É só editar. 💕
// ============================================================

// --- Textos da tela inicial ---------------------------------
export const intro = {
  eyebrow: "Eu te amo desde o dia que eu te vi no republic, Clara",
  word: 'Para sempre',
  subtitle:
    'Cada vez que eu te vejo,\nMeu coração começa a bater diferente.',
  cta: "",
  hint: 'To com você para sempre, meu amor, minha gatinha, meu bom dia e minha boa noite.',
}

// --- Mensagem que aparece DEPOIS do clique no coração -------
export const reveal = {
  title: 'Você é minha razão de sorrir quando eu acordo"\ne minha motivação para dormir e sonhar com você.',
  paragraphs: [
    'Desde o dia em que você chegou, minha vida ficou mais feliz, mais leve, mais viva.',
    'Eu podia escrever um livro inteiro e ainda assim, não ia ser o suficiente para falar o quanto eu te amo.',
    'Eu to aqui por você hoje, ontem, amanhã e para sempre.',
  ],
  signature: 'Para sempre todinho seu',
}

// --- Fotos do carrossel -------------------------------------
//  Substitua pelas SUAS fotos. Pode ser /public/fotos/1.jpg
//  ou qualquer URL. (Placeholders: Lorem Picsum)
export const fotos = [
  { src: 'https://picsum.photos/seed/amor1/800/1000', legenda: 'O começo de tudo' },
  { src: 'https://picsum.photos/seed/amor2/800/1000', legenda: 'Nossos risos' },
  { src: 'https://picsum.photos/seed/amor3/800/1000', legenda: 'Aquele dia especial' },
  { src: 'https://picsum.photos/seed/amor4/800/1000', legenda: 'Só nós dois' },
  { src: 'https://picsum.photos/seed/amor5/800/1000', legenda: 'Para sempre' },
]

// Intervalo (ms) de troca automática das fotos
export const FOTO_INTERVALO = 4000

// --- Playlist de fundo --------------------------------------
//  Substitua pelos seus arquivos de áudio (coloque em /public)
//  ou use links públicos .mp3. (Placeholders: SoundHelix)
export const playlist = [
  {
    titulo: 'Nossa música',
    artista: 'Trilha sonora do nosso amor',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  },
  {
    titulo: 'Para os bons momentos',
    artista: 'Só sentimento',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
]
