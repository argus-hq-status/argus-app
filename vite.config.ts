import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.API_URL ?? 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({ srcDirectory: 'src' }),
    viteReact(),
    nitro({
      preset: process.env.NITRO_PRESET ?? 'vercel',
      routeRules: {
        '/api/**': {
          proxy: `${process.env.API_URL ?? 'http://localhost:4000'}/api/**`,
        },
      },
    }),
  ],
})
