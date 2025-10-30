import { buildApp, type AppFastifyInstance } from '@/app'

export async function createTestApp(): Promise<AppFastifyInstance> {
  const app = await buildApp({
    config: {
      HOST: '127.0.0.1',
      LOG_LEVEL: 'silent',
      NODE_ENV: 'test',
      PORT: 0
    }
  })

  await app.ready()
  return app
}
