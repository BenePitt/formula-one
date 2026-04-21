/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        f1red: '#e10600',
        f1dark: '#15151e',
        f1card: '#1f1f2e',
        f1border: '#2f2f3e',
      },
      fontFamily: {
        f1: ['Formula1', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
