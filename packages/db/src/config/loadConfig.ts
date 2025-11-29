import { config as dotenv } from 'dotenv'

import { type DbConfig } from './envSchema'
import { parseDbConfig } from './parseConfig'

let cachedConfig: DbConfig | undefined

export function loadDbConfig(): DbConfig {
  if (cachedConfig) {
    return cachedConfig
  }

  dotenv({ quiet: true })
  cachedConfig = parseDbConfig(
    process.env,
    (error) => `Invalid database configuration: ${error.message}`
  )

  return cachedConfig
}

export function resetCachedDbConfig() {
  cachedConfig = undefined
}
