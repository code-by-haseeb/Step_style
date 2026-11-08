import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Inline PostCSS config so Vite doesn't pick up a postcss.config from a parent folder.
  css: { postcss: {} },
})
