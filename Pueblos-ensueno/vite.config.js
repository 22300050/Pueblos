import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['.ngrok-free.app'],
    proxy: {
      // 🔸 redirige las llamadas del front a tu backend IA
      '/api': 'http://localhost:3001'
    }
  }
})
