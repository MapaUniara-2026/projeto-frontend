import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// A versão exibida na tela vem do package.json deste repositório.
import pkg from './package.json' with { type: 'json' }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
})
