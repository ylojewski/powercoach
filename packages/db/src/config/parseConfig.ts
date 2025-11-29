import { ZodError } from 'zod'

import { dbEnvSchema, type DbConfig } from './envSchema'

export function parseDbConfig(config: unknown, format: (error: ZodError) => string): DbConfig {
  const result = dbEnvSchema.safeParse(config)

  if (!result.success) {
    throw new Error(format(result.error))
  }

  return result.data
}
