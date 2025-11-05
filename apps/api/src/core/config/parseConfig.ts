import { ZodError } from 'zod'
import { envSchema, type AppConfig } from './envSchema'

export function parseConfig(config: unknown, format: (error: ZodError) => string): AppConfig {
  const result = envSchema.safeParse(config)

  if (!result.success) {
    throw new Error(format(result.error))
  }

  return result.data
}
