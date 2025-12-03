import { type Options } from 'tsup'

import { buildConfig as buildBaseConfig, type PackageJson } from '../buildConfig'

export function buildConfig(pkg: PackageJson): Options {
  return { ...buildBaseConfig(pkg), dts: true }
}
