import { z, ZodError } from 'zod'

import { type Env } from './envSchema'

export function parseEnv<TEnv extends z.ZodType<Env>>(
  schema: TEnv,
  env: unknown,
  format: (error: ZodError) => string
): z.infer<TEnv> {
  const result = schema.safeParse(env)

  if (!result.success) {
    throw new Error(format(result.error))
  }

  return result.data
}
