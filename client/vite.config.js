import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige las peticiones de API
      '/api': 'http://localhost:3000',
      // Redirige el login
      '/login': 'http://localhost:3000',
      // Redirige las peticiones a los archivos subidos
      '/uploads': 'http://localhost:3000'
    }
  }
})
