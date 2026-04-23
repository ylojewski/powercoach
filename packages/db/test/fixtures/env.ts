import { NodeEnv } from '@powercoach/util-env'
import {
  INVALID_DATABASE_URL,
  INVALID_NODE_ENV,
  LOCAL_DATABASE_URL,
  POOLED_NEON_DATABASE_URL,
  UNKNOWN_DATABASE_URL_PROTOCOL
} from '@powercoach/util-fixture'

import { Env } from '@/src/core'

export const productionEnv: Env = {
  DATABASE_URL: POOLED_NEON_DATABASE_URL,
  NODE_ENV: NodeEnv.production
} as const

export const testEnv: Env = {
  DATABASE_URL: POOLED_NEON_DATABASE_URL,
  NODE_ENV: NodeEnv.test
} as const

export const developmentEnv: Env = {
  DATABASE_URL: LOCAL_DATABASE_URL,
  NODE_ENV: NodeEnv.development
} as const

export const invalidEnv: Env = {
  DATABASE_URL: INVALID_DATABASE_URL,
  NODE_ENV: INVALID_NODE_ENV as NodeEnv
} as const

export const unknownProtocolEnv: Env = {
  ...productionEnv,
  DATABASE_URL: UNKNOWN_DATABASE_URL_PROTOCOL
} as const
