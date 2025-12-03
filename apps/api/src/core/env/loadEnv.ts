import { createEnvLoader } from '@powercoach/util-env'

import { envSchema } from './envSchema'

export const { loadEnv, resetCachedConfig } = createEnvLoader({
  format: (error) => `Invalid environment: ${error.message}`,
  schema: envSchema
})
