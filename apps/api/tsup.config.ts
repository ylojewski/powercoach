import { config } from '@power/tsup-config'
import { defineConfig } from 'tsup'

export default defineConfig({
  ...config,
  entry: ['src/index.ts', 'src/server/index.ts'],
  outDir: 'dist'
})
