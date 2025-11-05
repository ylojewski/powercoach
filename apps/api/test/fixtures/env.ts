import { AppConfig } from '@src/core'
import { LogLevel, NodeEnv } from '@src/types'

export const productionConfig: AppConfig = {
  HOST: '127.0.0.1',
  LOG_LEVEL: LogLevel.error,
  NODE_ENV: NodeEnv.production,
  PORT: 4002
} as const

export const testConfig: AppConfig = {
  ...productionConfig,
  NODE_ENV: NodeEnv.test
} as const

export const invalidConfig: AppConfig = {
  HOST: '256.256.256.256',
  LOG_LEVEL: 'invalid' as LogLevel,
  NODE_ENV: 'invalid' as NodeEnv,
  PORT: 0
} as const

export const tooBigPortConfig: AppConfig = {
  ...testConfig,
  PORT: 70000
} as const
