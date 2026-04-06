import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { mediaCatalogPlugin } from './plugins/mediaCatalogPlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    mediaCatalogPlugin(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})
