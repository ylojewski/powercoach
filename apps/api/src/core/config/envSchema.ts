import { z } from 'zod'
import { LogLevel, NodeEnv } from '@/types'

export const envSchema = z.object({
  HOST: z.ipv4(),
  LOG_LEVEL: z.enum(LogLevel),
  NODE_ENV: z.enum(NodeEnv),
  PORT: z.coerce.number().int().min(1).max(65535)
})

export type AppConfig = z.infer<typeof envSchema>
