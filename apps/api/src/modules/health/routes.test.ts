import Fastify, { type RouteOptions } from 'fastify'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { registerHealthRoutes } from './routes'
import { HEALTH_RESPONSE_SCHEMA_ID, healthResponseSchema, type HealthResponse } from './schemas'
import * as serviceModule from './service'
import type { AppConfig } from '@/core/config/envSchema'
import { sensiblePlugin } from '@/plugins/sensible.plugin'

const baseConfig: AppConfig = {
  HOST: '127.0.0.1',
  LOG_LEVEL: 'silent',
  NODE_ENV: 'test',
  PORT: 0
}

const activeApps: ReturnType<typeof Fastify>[] = []

afterEach(async () => {
  while (activeApps.length > 0) {
    await activeApps.pop()?.close()
  }
})

function createApp() {
  const app = Fastify()
  app.decorate('config', baseConfig)
  app.addSchema(healthResponseSchema)
  activeApps.push(app)
  return app
}

describe('registerHealthRoutes', () => {
  it('registers a GET / route referencing the shared schema', async () => {
    const app = createApp()
    const routes: RouteOptions[] = []
    app.addHook('onRoute', (routeOptions) => {
      routes.push(routeOptions)
    })

    registerHealthRoutes(app)
    await app.ready()

    const healthRoute = routes.find((route) => route.method === 'GET' && route.url === '/')
    expect(healthRoute).toBeDefined()
    expect(healthRoute?.schema?.response?.[200]).toEqual({ $ref: `${HEALTH_RESPONSE_SCHEMA_ID}#` })
    expect(healthRoute?.schema?.operationId ?? undefined).toBeUndefined()
    expect(healthRoute?.schema?.summary ?? undefined).toBeUndefined()
    expect(healthRoute?.schema?.tags ?? undefined).toBeUndefined()

    const response = await app.inject({ method: 'GET', url: '/' })
    const body = response.json() as { ok: boolean; uptime: number }

    expect(response.statusCode).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.uptime).toBeGreaterThanOrEqual(0)
  })

  it('filters additional fields from the service response', async () => {
    const getHealthStatusSpy = vi
      .spyOn(serviceModule, 'getHealthStatus')
      .mockImplementation(
        () => ({ ok: true, uptime: 42, extra: 'nope' }) as unknown as HealthResponse
      )
    const app = createApp()

    registerHealthRoutes(app)
    await app.ready()

    const response = await app.inject({ method: 'GET', url: '/' })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ ok: true, uptime: 42 })

    getHealthStatusSpy.mockRestore()
  })

  it('returns JSON error payloads when the handler throws', async () => {
    const getHealthStatusSpy = vi.spyOn(serviceModule, 'getHealthStatus').mockImplementation(() => {
      throw new Error('boom')
    })
    const app = createApp()
    await app.register(sensiblePlugin)

    registerHealthRoutes(app)
    await app.ready()

    const response = await app.inject({ method: 'GET', url: '/' })
    expect(response.statusCode).toBe(500)
    expect(response.headers['content-type']).toContain('application/json')
    const payload = response.json() as { error: string; message: string; statusCode: number }
    expect(payload).toMatchObject({ error: 'Internal Server Error', statusCode: 500 })

    getHealthStatusSpy.mockRestore()
  })
})
