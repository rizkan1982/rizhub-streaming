import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Ensure VITE_API_BASE is embedded at build time
    'import.meta.env.VITE_API_BASE': JSON.stringify(process.env.VITE_API_BASE || '')
  }
})
