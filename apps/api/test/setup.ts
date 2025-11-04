import { buildApp, type AppFastifyInstance } from '@/app'
import { LOG_LEVEL, NODE_ENV } from '@/types/env.d'

export async function createTestApp(): Promise<AppFastifyInstance> {
  const app = await buildApp({
    config: {
      HOST: '127.0.0.1',
      LOG_LEVEL: LOG_LEVEL.silent,
      NODE_ENV: NODE_ENV.development,
      PORT: 0
    }
  })

  await app.ready()
  return app
}
