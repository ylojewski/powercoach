import { buildConfig } from '@powercoach/config/vite'
import { defineConfig, loadEnv, mergeConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './')
  return mergeConfig(buildConfig(import.meta.url), {
    server: {
      proxy: {
        '/api': {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
          target: env.VITE_API_BASE_URL
        }
      }
    }
  })
})
