import { z } from 'zod'
import { LOG_LEVEL, NODE_ENV } from '@/types/env.d'

export const envSchema = z.object({
  HOST: z.ipv4(),
  LOG_LEVEL: z.enum(LOG_LEVEL),
  NODE_ENV: z.enum(NODE_ENV),
  PORT: z.coerce.number().int().min(1).max(65535)
})

export type AppConfig = z.infer<typeof envSchema>
