import { buildConfig } from '@powercoach/config/vitest'
import { defineConfig } from 'vitest/config'

export default defineConfig(
  buildConfig(import.meta.url, {
    globalSetup: true,
    include: ['scripts'],
    setup: true
  })
)
