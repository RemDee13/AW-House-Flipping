/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#e8702a',
        'brand-dark': '#d2611f',
      },
    },
  },
  plugins: [],
}
