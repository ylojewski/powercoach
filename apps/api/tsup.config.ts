import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/server/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'node20',
  outDir: 'dist'
})
