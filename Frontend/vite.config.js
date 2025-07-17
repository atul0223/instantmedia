import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./cert/key.pem'),
      cert: fs.readFileSync('./cert/cert.pem')
    },
    port:5173, // or whatever port you prefer
    host: 'localhost'
  }
,
  plugins: [react(),tailwindcss()],
})
