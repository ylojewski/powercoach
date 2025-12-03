import { NodeEnv } from '@powercoach/util-env'

import { Env } from '@/src/core'
import { LogLevel } from '@/src/types'

export const productionConfig: Env = {
  HOST: '0.0.0.0',
  LOG_LEVEL: LogLevel.info,
  NODE_ENV: NodeEnv.production,
  PORT: 8080
} as const

export const testConfig: Env = {
  HOST: '0.0.0.0',
  LOG_LEVEL: LogLevel.info,
  NODE_ENV: NodeEnv.test,
  PORT: 8080
} as const

export const developmentConfig: Env = {
  HOST: 'localhost',
  LOG_LEVEL: LogLevel.debug,
  NODE_ENV: NodeEnv.development,
  PORT: 8080
} as const

export const invalidConfig: Env = {
  HOST: '256.256.256.256',
  LOG_LEVEL: 'invalid' as LogLevel,
  NODE_ENV: 'invalid' as NodeEnv,
  PORT: 0
} as const

export const tooBigPortConfig: Env = {
  ...testConfig,
  PORT: 70000
} as const
