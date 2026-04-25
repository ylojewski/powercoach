import { buildConfig } from '@powercoach/config/vite'
import tailwindcss from '@tailwindcss/vite'

export default buildConfig(import.meta.url, {
  api: true,
  exclude: ['src/api/generated'],
  include: ['scripts'],
  plugins: [tailwindcss()],
  setup: true
})
