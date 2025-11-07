import { config } from '@powercoach/config/tsup'
import { defineConfig } from 'tsup'

import pkg from './package.json'

const { main } = pkg
const dependencies = Object.keys(pkg.dependencies)
const devDependencies = Object.keys(pkg.devDependencies)

export default defineConfig({
  ...config,
  entry: [main],
  external: [...dependencies, ...devDependencies],
  noExternal: []
})
