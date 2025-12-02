import { Env } from '@/src/core'
import { NodeEnv } from '@/src/types'

export const productionConfig: Env = {
  DATABASE_URL:
    'postgresql://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require',
  NODE_ENV: NodeEnv.production
} as const

export const testConfig: Env = {
  DATABASE_URL:
    'postgresql://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require',
  NODE_ENV: NodeEnv.test
} as const

export const developmentConfig: Env = {
  DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/powercoach_dev',
  NODE_ENV: NodeEnv.development
} as const

export const invalidConfig: Env = {
  DATABASE_URL: 'invalid',
  NODE_ENV: 'invalid' as NodeEnv
} as const

export const unknownProtocolConfig: Env = {
  ...productionConfig,
  DATABASE_URL:
    'postgre://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require'
} as const
