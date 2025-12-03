import { defineConfig } from 'tsup'

import packageJson from './package.json'
import { buildConfig } from './src/tsup'

const config = buildConfig(packageJson)

export default defineConfig({
  ...config,
  entry: [
    'src/changeset/config.json',
    'src/commitlint/index.ts',
    'src/drizzle/index.ts',
    'src/eslint/index.ts',
    'src/lint-staged/index.ts',
    'src/prettier/index.ts',
    'src/ts/src.json',
    'src/ts/test.json',
    'src/tsup/dts/index.ts',
    'src/tsup/index.ts',
    'src/vite/index.ts',
    'src/vitest/index.ts'
  ],
  sourcemap: false
})
