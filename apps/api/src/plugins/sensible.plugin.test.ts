import Fastify from 'fastify'
import { describe, expect, it, vi } from 'vitest'
import { sensiblePlugin } from './sensible.plugin'
import type { AppConfig } from '@/core/config/envSchema'
import { registerHealthRoutes } from '@/modules/health/routes'
import { healthResponseSchema } from '@/modules/health/schemas'
import * as serviceModule from '@/modules/health/service'

const baseConfig: AppConfig = {
  HOST: '127.0.0.1',
  LOG_LEVEL: 'silent',
  NODE_ENV: 'test',
  PORT: 0
}

function createApp() {
  const app = Fastify()
  app.decorate('config', baseConfig)
  return app
}

describe('sensiblePlugin', () => {
  it('registers httpErrors helper', async () => {
    const app = createApp()
    await app.register(sensiblePlugin)
    await app.ready()

    expect(app.httpErrors).toBeDefined()
    expect(typeof app.httpErrors.badRequest).toBe('function')

    await app.close()
  })

  it('formats thrown httpErrors into JSON responses', async () => {
    const app = createApp()
    await app.register(sensiblePlugin)

    app.get('/bad', () => {
      throw app.httpErrors.badRequest('invalid payload')
    })

    await app.ready()

    const response = await app.inject({ method: 'GET', url: '/bad' })
    expect(response.statusCode).toBe(400)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.json()).toEqual({
      error: 'Bad Request',
      message: 'invalid payload',
      statusCode: 400
    })

    await app.close()
  })

  it('integrates with health route errors', async () => {
    const app = createApp()
    await app.register(sensiblePlugin)
    app.addSchema(healthResponseSchema)

    const spy = vi.spyOn(serviceModule, 'getHealthStatus').mockImplementation(() => {
      throw new Error('boom')
    })

    registerHealthRoutes(app)
    await app.ready()

    const response = await app.inject({ method: 'GET', url: '/' })
    expect(response.statusCode).toBe(500)
    expect(response.headers['content-type']).toContain('application/json')
    const payload = response.json() as { statusCode: number; message: string }
    expect(payload.statusCode).toBe(500)

    spy.mockRestore()
    await app.close()
  })
})
