import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    // ✅ USA path-ul corect
    https: {
      key: fs.readFileSync('/root/projects/server/certs/key.pem'),
      cert: fs.readFileSync('/root/projects/server/certs/cert.pem')
    },
    host: '0.0.0.0',
    port: 5173
  }
})
