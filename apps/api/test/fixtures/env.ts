import { AppConfig } from '@/core'
import { LOG_LEVEL, NODE_ENV } from '@/types/env.d'

export const productionConfig: AppConfig = {
  HOST: '127.0.0.1',
  LOG_LEVEL: LOG_LEVEL.error,
  NODE_ENV: NODE_ENV.production,
  PORT: 4002
} as const

export const testConfig: AppConfig = {
  ...productionConfig,
  NODE_ENV: NODE_ENV.test
} as const

export const invalidConfig: AppConfig = {
  HOST: '256.256.256.256',
  LOG_LEVEL: 'invalid' as LOG_LEVEL,
  NODE_ENV: 'invalid' as NODE_ENV,
  PORT: 0
} as const

export const tooBigPortConfig: AppConfig = {
  ...testConfig,
  PORT: 70000
} as const
