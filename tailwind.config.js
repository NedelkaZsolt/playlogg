/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pl: {
          bg:          '#08080c',
          surface:     '#0f0f15',
          card:        '#141419',
          cardHover:   '#19191f',
          border:      '#1e1e2a',
          borderLight: '#282835',
          orange:      '#3b82f6',
          orangeDim:   '#1e40af',
          orangeGlow:  'rgba(59,130,246,0.18)',
          text:        '#eaeaf2',
          muted:       '#56566e',
          muted2:      '#8888a8',
          green:       '#22c55e',
          greenDim:    'rgba(34,197,94,0.15)',
          red:         '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 24px rgba(59,130,246,0.3)',
        'glow-green':  '0 0 12px rgba(34,197,94,0.4)',
        'glow-blue':   '0 0 32px rgba(59,130,246,0.5)',
        'card':        '0 4px 24px rgba(0,0,0,0.5)',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.5' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out',
        pulse2: 'pulse2 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
