import { NodeEnv } from '@powercoach/util-env'

import { Env } from '@/src/core'

export const productionEnv: Env = {
  DATABASE_URL:
    'postgresql://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require',
  NODE_ENV: NodeEnv.production
} as const

export const testEnv: Env = {
  DATABASE_URL:
    'postgresql://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require',
  NODE_ENV: NodeEnv.test
} as const

export const developmentEnv: Env = {
  DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/powercoach_dev',
  NODE_ENV: NodeEnv.development
} as const

export const invalidEnv: Env = {
  DATABASE_URL: 'invalid',
  NODE_ENV: 'invalid' as NodeEnv
} as const

export const unknownProtocolEnv: Env = {
  ...productionEnv,
  DATABASE_URL:
    'postgre://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require'
} as const
