import { buildConfig } from '@powercoach/config/vite'
import tailwindcss from '@tailwindcss/vite'

export default buildConfig(import.meta.url, {
  aliases: {
    '@/app': 'src/app',
    '@/exercise': 'src/features/exercise',
    '@/roster': 'src/features/roster',
    '@/settings': 'src/features/settings'
  },
  api: true,
  exclude: ['src/api/generated'],
  include: ['scripts'],
  plugins: [tailwindcss()],
  setup: true
})
