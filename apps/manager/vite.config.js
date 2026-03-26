import { buildConfig } from '@powercoach/config/vite'
import tailwindcss from '@tailwindcss/vite'

export default buildConfig(import.meta.url, {
  api: true,
  include: ['scripts'],
  plugins: [tailwindcss()],
  setup: true
})
