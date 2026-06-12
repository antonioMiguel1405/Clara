# 💕 Declaração de Amor Interativa

Site interativo de declaração de amor — feito com **Vite + React + Tailwind CSS + Framer Motion + canvas-confetti**.

## ✨ O que ele faz

1. **Tela inicial** delicada (rosa claro), com a palavra **"Love"** em gradiente e um **coração pulsante** dentro de um círculo com glow.
2. Ao **clicar no coração**:
   - Transição suave (fade-out / fade-in);
   - 🎵 **Música de fundo** começa a tocar (player discreto com play/pause, próxima e mute);
   - 🖼️ **Galeria de fotos** em slideshow automático;
   - 💗 **Chuva de corações** (confete) no momento do clique.
3. Totalmente **responsivo** (mobile-first).

## 🚀 Rodando localmente

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (geralmente http://localhost:5173).

## ☁️ Deploy na Vercel

1. Suba este projeto para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. A Vercel detecta o **Vite** automaticamente (Build: `npm run build`, Output: `dist`). Basta clicar em **Deploy**.

Ou pelo terminal:

```bash
npm i -g vercel
vercel
```

## 🎨 Como personalizar

Tudo o que importa está em **`src/data/content.js`**:

- `intro` / `reveal` → textos das duas telas;
- `fotos` → suas fotos (troque as URLs ou coloque imagens em `/public` e use `/minha-foto.jpg`);
- `playlist` → suas músicas (URLs `.mp3` ou arquivos em `/public`);
- `FOTO_INTERVALO` → velocidade do slideshow.

> ⚠️ As fotos (Lorem Picsum) e músicas (SoundHelix) são **placeholders** — substitua pelas suas!

## 📁 Estrutura

```
.
├── index.html              # fontes do Google + root
├── vercel.json             # config de deploy
├── tailwind.config.js
├── src
│   ├── main.jsx
│   ├── App.jsx             # estado + chuva de corações
│   ├── index.css
│   ├── data/content.js     # ← EDITE AQUI (textos, fotos, músicas)
│   └── components
│       ├── IntroScreen.jsx
│       ├── RevealScreen.jsx
│       ├── PhotoGallery.jsx
│       ├── MusicPlayer.jsx
│       ├── FloatingHearts.jsx
│       └── Divider.jsx
```

Feito com carinho. ❤️
