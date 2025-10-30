import { z } from 'zod'

const logLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const

export const envSchema = z.object({
  HOST: z.string().min(1).default('0.0.0.0'),
  LOG_LEVEL: z.enum(logLevels).default('info'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(0).max(65535).default(3000)
})

export type AppConfig = z.infer<typeof envSchema>
