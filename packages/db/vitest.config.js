import { buildConfig } from '@powercoach/config/vitest'
import { neonTesting } from 'neon-testing/vite'
import { defineConfig, mergeConfig } from 'vitest/config'

export default defineConfig(
  mergeConfig(buildConfig(import.meta.url), {
    plugins: [neonTesting()]
  })
)
