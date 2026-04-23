import { NodeEnv } from '@powercoach/util-env'
import {
  DEFAULT_PORT,
  INVALID_DATABASE_URL_PROTOCOL,
  INVALID_HOST,
  INVALID_LOG_LEVEL,
  INVALID_NODE_ENV,
  LOCAL_DATABASE_URL,
  LOCAL_HOST,
  NEON_DATABASE_URL,
  PUBLIC_HOST,
  TEST_DATABASE_URL,
  TOO_BIG_PORT
} from '@powercoach/util-fixture'

import { Env } from '@/src/core'
import { LogLevel } from '@/src/types'

export const productionEnv: Env = {
  DATABASE_URL: NEON_DATABASE_URL,
  HOST: PUBLIC_HOST,
  LOG_LEVEL: LogLevel.info,
  NODE_ENV: NodeEnv.production,
  PORT: DEFAULT_PORT
} as const

export const testEnv: Env = {
  DATABASE_URL: TEST_DATABASE_URL,
  HOST: PUBLIC_HOST,
  LOG_LEVEL: LogLevel.info,
  NODE_ENV: NodeEnv.test,
  PORT: DEFAULT_PORT
} as const

export const developmentEnv: Env = {
  DATABASE_URL: LOCAL_DATABASE_URL,
  HOST: LOCAL_HOST,
  LOG_LEVEL: LogLevel.debug,
  NODE_ENV: NodeEnv.development,
  PORT: DEFAULT_PORT
} as const

export const invalidEnv: Env = {
  DATABASE_URL: INVALID_DATABASE_URL_PROTOCOL,
  HOST: INVALID_HOST,
  LOG_LEVEL: INVALID_LOG_LEVEL as LogLevel,
  NODE_ENV: INVALID_NODE_ENV as NodeEnv,
  PORT: 0
} as const

export const tooBigPortEnv: Env = {
  ...testEnv,
  PORT: TOO_BIG_PORT
} as const

export function createRealEnv(env: 'production' | 'test' = 'test'): Env {
  const { DATABASE_URL } = process.env

  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }

  return {
    ...(env === 'production' ? productionEnv : testEnv),
    DATABASE_URL
  }
}
