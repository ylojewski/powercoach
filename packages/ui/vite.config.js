import { buildConfig } from '@powercoach/config/vite'

export default buildConfig(import.meta.url, {
  exclude: ['lib/**/*.stories.tsx'],
  lib: true
})
