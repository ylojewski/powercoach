import { config as dotenv } from 'dotenv'
import { z, ZodError } from 'zod'

import { NodeEnv } from '@/src/types'

import { type Env } from './envSchema'
import { parseEnv } from './parseEnv'

export interface CreateEnvLoaderOptions<TEnv extends z.ZodType<Env>> {
  format: (error: ZodError) => string
  schema: TEnv
}

export function createEnvLoader<TEnv extends z.ZodType<Env>>({
  format,
  schema
}: CreateEnvLoaderOptions<TEnv>) {
  let cachedEnv: Readonly<z.infer<TEnv>> | undefined
  const initialNodeEnv = process.env.NODE_ENV as NodeEnv

  function loadEnv(): Readonly<z.infer<TEnv>> {
    if (cachedEnv) {
      return cachedEnv
    }

    dotenv({ quiet: true })
    cachedEnv = Object.freeze(parseEnv(schema, process.env, format))

    return cachedEnv
  }

  function resetCachedEnv() {
    if (initialNodeEnv !== NodeEnv.production) {
      cachedEnv = undefined
    }
  }

  return {
    loadEnv,
    resetCachedEnv
  }
}
