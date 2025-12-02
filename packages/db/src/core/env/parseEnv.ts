import { ZodError } from 'zod'

import { envSchema, type Env } from './envSchema'

export function parseEnv(config: unknown, format: (error: ZodError) => string): Env {
  const result = envSchema.safeParse(config)

  if (!result.success) {
    throw new Error(format(result.error))
  }

  return result.data
}
