import { buildConfig } from '@powercoach/config/tsup/dts'
import { defineConfig } from 'tsup'

import packageJson from './package.json'

const config = buildConfig({ ...packageJson, main: 'src/index.ts' })

export default defineConfig({
  ...config,
  entry: ['src/index.ts', 'src/react/index.ts']
})
