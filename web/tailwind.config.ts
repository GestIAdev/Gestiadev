import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0A0A1A',        // Fondo Principal - Azul Noche Tecnológico
        'accent': '#00F2A9',         // Acento Principal - Verde Menta Eléctrico
        'text-primary': '#EAEAEA',   // Texto Principal - Blanco Hueso
        'text-secondary': '#888888', // Texto Secundario - Gris Neutro
        'border': '#333333',         // Bordes y Líneas - Gris Trazado
      },
      fontFamily: {
        'mono': ['IBM Plex Mono', 'monospace'],
        'sans': ['IBM Plex Sans', 'sans-serif'],
        'code': ['Space Mono', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 1s infinite',
        'draw-border': 'draw-border 1s forwards',
        'text-scramble': 'text-scramble 2s forwards',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '33%': { transform: 'translate(-5px, 2px)' },
          '66%': { transform: 'translate(5px, -2px)' },
        },
        'draw-border': {
          '0%': { width: '0%', height: '0%' },
          '50%': { width: '100%', height: '0%' },
          '100%': { width: '100%', height: '100%' },
        },
        'text-scramble': {
          '0%': { filter: 'blur(1px)', opacity: '0' },
          '100%': { filter: 'blur(0)', opacity: '1' },
        },
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(250px, 1fr))',
      },
    },
  },
  plugins: [],
}

export default config
