import { config } from 'dotenv'
import { envSchema, type AppConfig } from './envSchema'

let cachedConfig: AppConfig | undefined

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
