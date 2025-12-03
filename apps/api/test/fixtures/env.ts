import { NodeEnv } from '@powercoach/util-env'

import { Env } from '@/src/core'
import { LogLevel } from '@/src/types'

export const productionEnv: Env = {
  HOST: '0.0.0.0',
  LOG_LEVEL: LogLevel.info,
  NODE_ENV: NodeEnv.production,
  PORT: 8080
} as const

export const testEnv: Env = {
  HOST: '0.0.0.0',
  LOG_LEVEL: LogLevel.info,
  NODE_ENV: NodeEnv.test,
  PORT: 8080
} as const

export const developmentEnv: Env = {
  HOST: 'localhost',
  LOG_LEVEL: LogLevel.debug,
  NODE_ENV: NodeEnv.development,
  PORT: 8080
} as const

export const invalidEnv: Env = {
  HOST: '256.256.256.256',
  LOG_LEVEL: 'invalid' as LogLevel,
  NODE_ENV: 'invalid' as NodeEnv,
  PORT: 0
} as const

export const tooBigPortEnv: Env = {
  ...testEnv,
  PORT: 70000
} as const
