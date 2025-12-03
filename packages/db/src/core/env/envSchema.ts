import { envSchema as baseEnvSchema } from '@powercoach/util-env'
import { z } from 'zod'

export const envSchema = baseEnvSchema.extend({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ })
})

export type Env = z.infer<typeof envSchema>
