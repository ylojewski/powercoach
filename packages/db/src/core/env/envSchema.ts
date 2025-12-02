import { z } from 'zod'

import { NodeEnv } from '@/src/types'

export const envSchema = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  NODE_ENV: z.enum(NodeEnv)
})

export type Env = z.infer<typeof envSchema>
