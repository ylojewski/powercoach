import { INVALID_NODE_ENV } from '@powercoach/util-fixture'

import { Env } from '@/src/core'
import { NodeEnv } from '@/src/types'

export const productionEnv: Env = {
  NODE_ENV: NodeEnv.production
} as const

export const testEnv: Env = {
  NODE_ENV: NodeEnv.test
} as const

export const developmentEnv: Env = {
  NODE_ENV: NodeEnv.development
} as const

export const invalidEnv: Env = {
  NODE_ENV: INVALID_NODE_ENV as NodeEnv
} as const
