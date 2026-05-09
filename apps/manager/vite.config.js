import { buildConfig } from '@powercoach/config/vite'
import tailwindcss from '@tailwindcss/vite'

export default buildConfig(import.meta.url, {
  aliases: {
    '@/app': 'src/app',
    '@/core': 'src/core',
    '@/modules': 'src/modules'
  },
  api: true,
  exclude: ['src/core/api/generated', 'src/app/types', 'src/core/types'],
  include: ['scripts'],
  plugins: [tailwindcss()],
  setup: true
})
