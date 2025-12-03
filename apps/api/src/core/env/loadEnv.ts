import { createEnvLoader } from '@powercoach/util-env'

import { envSchema } from './envSchema'

export const { loadEnv, resetCachedEnv } = createEnvLoader({
  format: (error) => `Invalid environment: ${error.message}`,
  schema: envSchema
})
