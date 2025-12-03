import { buildConfig } from '@powercoach/config/tsup/dts'
import { defineConfig } from 'tsup'

import packageJson from './package.json'

export default defineConfig(buildConfig({ ...packageJson, main: 'src/index.ts' }))
