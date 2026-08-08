import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => ({
  // Relative production URLs keep every public asset inside this repository's
  // Pages directory instead of relying on a domain-root `/assets/` path.
  base: './',
  plugins: [react()],
}))
