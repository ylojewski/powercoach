import { buildConfig } from '@powercoach/config/vite'
import tailwindcss from '@tailwindcss/vite'

export default buildConfig(import.meta.url, {
  aliases: {
    '@/api': 'src/api',
    '@/core': 'src/core',
    '@/modules': 'src/modules',
    '@/shared': 'src/shared'
  },
  api: true,
  exclude: ['src/api/generated'],
  include: ['scripts'],
  plugins: [tailwindcss()],
  setup: true
})
