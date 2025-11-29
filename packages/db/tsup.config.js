import { buildConfig } from '@powercoach/config/tsup'
import { defineConfig } from 'tsup'

import pkg from './package.json'

const baseConfig = buildConfig({ ...pkg, main: 'src/index.ts' })

export default defineConfig({
  ...baseConfig,
  dts: true
})
