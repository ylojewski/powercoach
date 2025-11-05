import { config } from 'dotenv'
import { envSchema, type AppConfig } from './envSchema'
import { NODE_ENV } from '@/types/env.d'

let cachedConfig: AppConfig | undefined
const initialNodeEnv = process.env.NODE_ENV as NODE_ENV

export function loadConfig(): AppConfig {
  if (cachedConfig) {
    return cachedConfig
  }

  config()
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    throw new Error(`Invalid environment configuration: ${result.error.message}`)
  }

  cachedConfig = Object.freeze(result.data)
  return cachedConfig
}

export function resetCachedConfig() {
  if (initialNodeEnv !== NODE_ENV.production) {
    cachedConfig = undefined
  }
}
