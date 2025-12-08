import { envSchema as dbEnvSchema } from '@powercoach/db'
import { z } from 'zod'

import { LogLevel } from '@/src/types'

export const envSchema = dbEnvSchema.extend({
  HOST: z.union([z.ipv4(), z.literal('localhost')]),
  LOG_LEVEL: z.enum(LogLevel),
  PORT: z.coerce.number().int().min(1).max(65535)
})

export type Env = z.infer<typeof envSchema>
