/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ieee: {
          blue: '#00629B',
          dark: '#002855',
        }
      }
    },
  },
  plugins: [],
}
