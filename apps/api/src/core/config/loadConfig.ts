import { config as loadEnv } from 'dotenv'
import process from 'node:process'
import { envSchema, type AppConfig } from './envSchema'

type ProcessEnv = typeof process.env

let cachedConfig: AppConfig | undefined

export function loadConfig(env: ProcessEnv = process.env): AppConfig {
  if (cachedConfig) {
    return cachedConfig
  }

  loadEnv()
  const result = envSchema.safeParse({
    HOST: env.HOST,
    LOG_LEVEL: env.LOG_LEVEL,
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT
  })

  if (!result.success) {
    throw new Error(`[config] Invalid environment: ${result.error.message}`)
  }

  cachedConfig = Object.freeze(result.data)
  return cachedConfig
}
