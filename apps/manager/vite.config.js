import { buildConfig } from '@powercoach/config/vite'
import tailwindcss from '@tailwindcss/vite'

export default buildConfig(import.meta.url, {
  aliases: {
    '@/app': 'src/app',
    '@/modules': 'src/modules'
  },
  api: true,
  exclude: ['src/api/generated', 'src/app/types'],
  include: ['scripts'],
  plugins: [tailwindcss()],
  setup: true
})
