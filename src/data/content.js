// ============================================================
//  CONTEÚDO PERSONALIZÁVEL
//  Troque os textos, fotos e músicas aqui. É só editar. 💕
// ============================================================

// --- Textos da tela inicial ---------------------------------
export const intro = {
  eyebrow: "I've been carrying this in my heart for so long...",
  word: 'Love',
  subtitle:
    'Every moment since you walked into my life,\nthe universe feels a little more magical.',
  cta: "Click the heart when you're ready...",
  hint: '(Some feelings are too precious to rush)',
}

// --- Mensagem que aparece DEPOIS do clique no coração -------
export const reveal = {
  title: 'You are my favorite "good morning"\nand my hardest "goodnight".',
  paragraphs: [
    'Desde o dia em que você chegou, tudo ficou mais leve, mais colorido, mais nosso.',
    'Eu poderia reescrever o universo inteiro e, ainda assim, escolheria você em cada versão dele.',
    'Obrigado por existir e por me deixar fazer parte da sua história.',
  ],
  signature: 'Para sempre seu(sua) ❤️',
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
