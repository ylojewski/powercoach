import { buildConfig } from '@powercoach/config/vite'
import { defineConfig } from 'vite'

export default defineConfig(buildConfig(import.meta.url))
