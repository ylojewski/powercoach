import { buildConfig } from '@powercoach/config/tsup'
import { defineConfig } from 'tsup'

import pkg from './package.json'

export default defineConfig(buildConfig(pkg))
