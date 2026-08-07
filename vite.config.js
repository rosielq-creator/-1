import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project from /-1/, while local development stays at /.
  base: command === 'build' ? '/-1/' : '/',
  plugins: [react()],
}))
