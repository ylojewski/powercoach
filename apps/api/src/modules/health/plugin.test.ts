import Fastify from 'fastify'
import { describe, expect, it } from 'vitest'
import { healthModule } from './plugin'
import { HEALTH_RESPONSE_SCHEMA_ID } from './schemas'
import type { AppConfig } from '@/core/config/envSchema'

const baseConfig: AppConfig = {
  HOST: '127.0.0.1',
  LOG_LEVEL: 'silent',
  NODE_ENV: 'test',
  PORT: 0
}

async function createApp(prefix: string) {
  const app = Fastify()
  app.decorate('config', baseConfig)
  await app.register(healthModule, { prefix })
  await app.ready()
  return app
}

describe('healthModule plugin', () => {
  it('registers health route under the provided prefix', async () => {
    const app = await createApp('/v1/health')

    const response = await app.inject({ method: 'GET', url: '/v1/health' })
    const body = response.json() as { ok: boolean; uptime: number }

    expect(response.statusCode).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.uptime).toBeGreaterThanOrEqual(0)

    await app.close()
  })

  it('exposes compiled schema via getSchema', async () => {
    const app = Fastify()
    app.decorate('config', baseConfig)
    const addSchemaSpy = vi.spyOn(app, 'addSchema')

    await app.register(healthModule, { prefix: '/status' })
    await app.ready()

    expect(addSchemaSpy).toHaveBeenCalledWith(
      expect.objectContaining({ $id: HEALTH_RESPONSE_SCHEMA_ID })
    )

    await app.close()
  })

  it('can be registered multiple times without duplication issues', async () => {
    const app = Fastify()
    app.decorate('config', baseConfig)

    await app.register(healthModule, { prefix: '/a' })
    await app.register(healthModule, { prefix: '/b' })
    await app.ready()

    const first = await app.inject({ method: 'GET', url: '/a' })
    const second = await app.inject({ method: 'GET', url: '/b' })

    expect(first.statusCode).toBe(200)
    expect(second.statusCode).toBe(200)

    await app.close()
  })

  it('respects custom prefixes', async () => {
    const app = await createApp('/healthz')

    const response = await app.inject({ method: 'GET', url: '/healthz' })
    expect(response.statusCode).toBe(200)

    await app.close()
  })
})
