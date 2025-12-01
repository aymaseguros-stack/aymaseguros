/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ayma-blue': '#1e40af',
        'ayma-blue-dark': '#1e3a8a',
        'ayma-blue-light': '#3b82f6',
      },
    },
  },
  plugins: [],
}
