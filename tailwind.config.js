/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        hand: ['"Caveat"', 'cursive'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        rosa: {
          bg: '#FFF0F5',
          soft: '#FFE4EF',
          mid: '#FF8FB1',
          deep: '#FF4E8B',
        },
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.6' },
          '50%': { transform: 'translateY(-22px) rotate(8deg)', opacity: '1' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.18)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.12)' },
          '60%': { transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 25px 6px rgba(255,143,177,0.45)' },
          '50%': { boxShadow: '0 0 45px 14px rgba(255,78,139,0.55)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        heartbeat: 'heartbeat 1.6s ease-in-out infinite',
        glow: 'glow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
