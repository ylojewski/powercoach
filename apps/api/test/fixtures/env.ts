import { NodeEnv } from '@powercoach/util-env'
import { inject } from 'vitest'

import { Env } from '@/src/core'
import { LogLevel } from '@/src/types'

export const productionEnv: Env = {
  DATABASE_URL: 'postgresql://user:password@region.neon.tech/neondb?sslmode=require',
  HOST: '0.0.0.0',
  LOG_LEVEL: LogLevel.info,
  NODE_ENV: NodeEnv.production,
  PORT: 8080
} as const

export const testEnv: Env = {
  DATABASE_URL: 'postgres://test:test@localhost:55000/test_00000000-0000-4000-0000-000000000000',
  HOST: '0.0.0.0',
  LOG_LEVEL: LogLevel.info,
  NODE_ENV: NodeEnv.test,
  PORT: 8080
} as const

export const developmentEnv: Env = {
  DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/powercoach_dev',
  HOST: 'localhost',
  LOG_LEVEL: LogLevel.debug,
  NODE_ENV: NodeEnv.development,
  PORT: 8080
} as const

export const invalidEnv: Env = {
  DATABASE_URL: 'postgr://postgres:postgres@localhost:5432/powercoach_dev',
  HOST: '256.256.256.256',
  LOG_LEVEL: 'invalid' as LogLevel,
  NODE_ENV: 'invalid' as NodeEnv,
  PORT: 0
} as const

export const tooBigPortEnv: Env = {
  ...testEnv,
  PORT: 70000
} as const

export function createRealEnv(env: 'production' | 'test' = 'test'): Env {
  return {
    ...(env === 'production' ? productionEnv : env === 'test' ? testEnv : developmentEnv),
    DATABASE_URL: inject('databaseUrl')
  }
}
