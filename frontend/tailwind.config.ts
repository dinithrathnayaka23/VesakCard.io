import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-sinhala)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-noto-serif-sinhala)', 'serif']
      },
      boxShadow: {
        cardGlow: '0 24px 80px rgba(15, 23, 42, 0.34)'
      }
    }
  },
  plugins: []
}

export default config
