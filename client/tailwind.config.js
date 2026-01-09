/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Aquí recuperamos la fuente bonita que pusimos ayer
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // Esto ayuda con los colores si usaste personalizados
      colors: {
        primary: '#4F46E5', // Un ejemplo, ajusta si tenías otros
      }
    },
  },
  plugins: [],
}