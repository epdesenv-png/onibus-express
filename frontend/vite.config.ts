import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api em dev para evitar CORS ao rodar frontend separado da API
    proxy: {
      '/rotas': { target: 'http://localhost:8080', changeOrigin: true },
      '/viagens': { target: 'http://localhost:8080', changeOrigin: true },
      '/reservas': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
