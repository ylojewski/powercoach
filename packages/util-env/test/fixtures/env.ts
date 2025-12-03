import { Env } from '@/src/core'
import { NodeEnv } from '@/src/types'

export const productionConfig: Env = {
  NODE_ENV: NodeEnv.production
} as const

export const testConfig: Env = {
  NODE_ENV: NodeEnv.test
} as const

export const developmentConfig: Env = {
  NODE_ENV: NodeEnv.development
} as const

export const invalidConfig: Env = {
  NODE_ENV: 'invalid' as NodeEnv
} as const
