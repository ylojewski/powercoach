import { config as dotenv } from 'dotenv'

import { NodeEnv } from '@/src/types'

import { type Env } from './envSchema'
import { parseEnv } from './parseEnv'

let cachedEnv: Env | undefined
const initialNodeEnv = process.env.NODE_ENV as NodeEnv

export function loadEnv(): Env {
  if (cachedEnv) {
    return cachedEnv
  }

  dotenv({ quiet: true })

  cachedEnv = Object.freeze(
    parseEnv(process.env, (error) => `Invalid environment: ${error.message}`)
  )

  return cachedEnv
}

export function resetCachedConfig() {
  if (initialNodeEnv !== NodeEnv.production) {
    cachedEnv = undefined
  }
}
