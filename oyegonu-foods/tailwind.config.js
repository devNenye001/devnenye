/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stew: {
          950: '#170604',
          900: '#250a06',
          800: '#3f1109',
          700: '#5e1a0d',
          600: '#7f2512',
          500: '#9c3418',
        },
        lid: { DEFAULT: '#d4241c', deep: '#a8160f', soft: '#e8493e' },
        gold: { DEFAULT: '#e3b862', soft: '#efd49a', deep: '#c6913a', ink: '#8a5a17' },
        cream: '#f6ecda',
        paper: '#fbf5ea',
        ink: '#1a0f0a',
        leaf: '#5f8f32',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { tightest: '-0.06em' },
      transitionTimingFunction: { expo: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [],
}
