import { config } from '@power/config/tsup'
import { defineConfig } from 'tsup'

export default defineConfig({
  ...config,
  entry: ['src/index.ts', 'src/server/index.ts'],
  outDir: 'dist'
})
