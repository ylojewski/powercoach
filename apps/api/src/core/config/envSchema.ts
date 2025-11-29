import { z } from 'zod'

import { LogLevel, NodeEnv } from '@/src/types'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  HOST: z.union([z.ipv4(), z.literal('localhost')]),
  LOG_LEVEL: z.enum(LogLevel),
  NODE_ENV: z.enum(NodeEnv),
  PORT: z.coerce.number().int().min(1).max(65535)
})

export type AppConfig = z.infer<typeof envSchema>
