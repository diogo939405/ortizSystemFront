import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = import.meta.env.VITE_BASE_PATH || '/ortizSystemFront'
export default defineConfig({
  plugins: [react()],
  base: base,
})
