import type { FastifyInstance } from 'fastify'

import { buildApp } from '../src/app'

export async function createTestApp(): Promise<FastifyInstance> {
  const app = await buildApp({
    config: {
      NODE_ENV: 'test',
      HOST: '127.0.0.1',
      PORT: 0,
      LOG_LEVEL: 'silent'
    }
  })

  await app.ready()
  return app
}
