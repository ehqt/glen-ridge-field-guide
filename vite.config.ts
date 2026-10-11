import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fieldGuideData } from './plugins/field-guide-data.ts'

// Relative base + hash routing (src/main.tsx) so the build works on GitHub
// Pages whether it is served from the domain root or a project subpath.
export default defineConfig({
  base: './',
  plugins: [react(), fieldGuideData()],
})
