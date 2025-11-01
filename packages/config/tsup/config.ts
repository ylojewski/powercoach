import type { Options } from 'tsup'

export const config: Options = {
  clean: true,
  dts: true,
  format: ['esm'],
  sourcemap: true,
  target: 'node20'
}
