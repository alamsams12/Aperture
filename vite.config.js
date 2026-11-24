import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react()],
  base: '/Aperture/',
})
export default defineConfig({ plugins: [react(), tailwindcss()] })
