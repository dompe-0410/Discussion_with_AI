import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages project sites are served below /<repository-name>/.
  base: '/Discussion_with_AI/',
})
