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
  const result = envSchema.safeParse(env)

  if (!result.success) {
    throw new Error(`Invalid environment configuration: ${result.error.message}`)
  }

  cachedConfig = Object.freeze(result.data)
  return cachedConfig
}
