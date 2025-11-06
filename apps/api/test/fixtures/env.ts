import { AppConfig } from '@/src/core'
import { LogLevel, NodeEnv } from '@/src/types'

export const productionConfig: AppConfig = {
  HOST: '10.0.0.10',
  LOG_LEVEL: LogLevel.error,
  NODE_ENV: NodeEnv.production,
  PORT: 3000
} as const

export const testConfig: AppConfig = {
  HOST: '0.0.0.0',
  LOG_LEVEL: LogLevel.debug,
  NODE_ENV: NodeEnv.test,
  PORT: 1
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
