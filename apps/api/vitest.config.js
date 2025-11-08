import { buildConfig } from '@powercoach/config/vitest'
import { defineConfig } from 'vitest/config'

export default defineConfig(buildConfig(import.meta.url))
