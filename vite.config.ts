import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In production (GitHub Pages) the site lives under /AW-House-Flipping/.
// In dev we serve from root so the Preview/dev server works at "/".
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/AW-House-Flipping/' : '/',
  plugins: [react()],
}))
