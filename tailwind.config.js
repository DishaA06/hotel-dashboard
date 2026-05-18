/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        cream: {
          50: '#fdfcf8',
          100: '#f9f6ef',
          200: '#f0ead8',
        },
        slate: {
          850: '#1a2234',
          950: '#0d1424',
        }
      }
    },
  },
  plugins: [],
}
