import { config as dotenv } from 'dotenv'
import { type AppConfig } from './envSchema'
import { parseConfig } from '@/core/config/parseConfig'
import { NodeEnv } from '@/types'

let cachedConfig: AppConfig | undefined
const initialNodeEnv = process.env.NODE_ENV as NodeEnv

export function loadConfig(): AppConfig {
  if (cachedConfig) {
    return cachedConfig
  }

  dotenv()

  cachedConfig = Object.freeze(
    parseConfig(process.env, (error) => `Invalid environment configuration: ${error.message}`)
  )

  return cachedConfig
}

export function resetCachedConfig() {
  if (initialNodeEnv !== NodeEnv.production) {
    cachedConfig = undefined
  }
}
