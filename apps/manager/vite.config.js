import { buildConfig } from '@powercoach/config/vite'
import tailwindcss from '@tailwindcss/vite'

export default buildConfig(import.meta.url, {
  aliases: {
    '@/app': 'src/app',
    '@/core': 'src/core',
    '@/modules': 'src/modules'
  },
  api: true,
  exclude: ['src/core/api/generated', 'src/app/types', 'src/core/types', 'src/**/types/**'],
  include: ['scripts'],
  ngrok: '9724-2a01-cb18-8684-bb00-948e-74b4-adec-862',
  plugins: [tailwindcss()],
  setup: true
})
