import { AppConfig } from '@/src/core'
import { LogLevel, NodeEnv } from '@/src/types'

export const productionConfig: AppConfig = {
  HOST: '0.0.0.0',
  LOG_LEVEL: LogLevel.info,
  NODE_ENV: NodeEnv.production,
  PORT: 8080
} as const

export const testConfig: AppConfig = {
  HOST: '0.0.0.0',
  LOG_LEVEL: LogLevel.info,
  NODE_ENV: NodeEnv.test,
  PORT: 8080
} as const

export const developmentConfig: AppConfig = {
  HOST: 'localhost',
  LOG_LEVEL: LogLevel.debug,
  NODE_ENV: NodeEnv.development,
  PORT: 8080
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
