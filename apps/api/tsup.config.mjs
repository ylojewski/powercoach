import { config } from '@powercoach/config/tsup'
import { defineConfig } from 'tsup'

export default defineConfig({
  ...config,
  entry: ['src/index.ts', 'src/server/index.ts'],
  outDir: 'dist',
  tsconfig: './tsconfig.src.json'
})
