import { buildConfig } from '@powercoach/config/vite'
import tailwindcss from '@tailwindcss/vite'

export default buildConfig(import.meta.url, {
  exclude: ['src/**/*.stories.tsx'],
  lib: true,
  plugins: [tailwindcss()]
})
