import { expectHasHeader, expectHeaderEquals } from '@test/utils/headers'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildApp } from './buildApp'
import { loadConfig } from '../core/config/loadConfig'
import type { AppFastifyInstance } from './buildApp'
import type { AppConfig } from '../core/config/envSchema'
import type { FastifyRequest } from 'fastify'

vi.mock('../core/config/loadConfig', () => ({
  loadConfig: vi.fn(() => ({
    HOST: '127.0.0.1',
    LOG_LEVEL: 'silent',
    NODE_ENV: 'test',
    PORT: 0
  }))
}))

const baseConfig: AppConfig = {
  HOST: '127.0.0.1',
  LOG_LEVEL: 'silent',
  NODE_ENV: 'test',
  PORT: 0
}

const activeApps: AppFastifyInstance[] = []

afterEach(async () => {
  vi.clearAllMocks()
  while (activeApps.length > 0) {
    await activeApps.pop()?.close()
  }
})

describe('buildApp', () => {
  const buildWithConfig = async (overrides: Partial<AppConfig> = {}) => {
    const app = await buildApp({ config: { ...baseConfig, ...overrides } })
    activeApps.push(app)
    return app
  }

  it('calls loadConfig only when no config override is provided', async () => {
    const config: AppConfig = { ...baseConfig, PORT: 4321 }

    const firstApp = await buildApp()
    activeApps.push(firstApp)
    expect(loadConfig).toHaveBeenCalledTimes(1)
    expect(firstApp.config).toEqual({
      HOST: '127.0.0.1',
      LOG_LEVEL: 'silent',
      NODE_ENV: 'test',
      PORT: 0
    })

    vi.mocked(loadConfig).mockClear()

    const secondApp = await buildApp({ config })
    activeApps.push(secondApp)

    expect(loadConfig).not.toHaveBeenCalled()
    expect(secondApp.config).toBe(config)
    expect(secondApp.config).toMatchObject({
      HOST: '127.0.0.1',
      LOG_LEVEL: 'silent',
      NODE_ENV: 'test',
      PORT: 4321
    })
  })

  it('generates distinct request ids when header is absent', async () => {
    const app = await buildWithConfig()

    const first = await app.inject({ method: 'GET', url: '/v1/health' })
    const second = await app.inject({ method: 'GET', url: '/v1/health' })

    expectHasHeader(first, 'x-request-id')
    expectHasHeader(second, 'x-request-id')
    expect(first.headers['x-request-id']).not.toBe(second.headers['x-request-id'])
  })

  it('respects incoming x-request-id header', async () => {
    const app = await buildWithConfig()

    const response = await app.inject({
      headers: { 'x-request-id': 'abc' },
      method: 'GET',
      url: '/v1/health'
    })

    expectHeaderEquals(response, 'x-request-id', 'abc')
  })

  it('registers helmet plugin and exposes security headers', async () => {
    const app = await buildWithConfig()

    const response = await app.inject({ method: 'GET', url: '/v1/health' })

    expectHeaderEquals(response, 'x-dns-prefetch-control', 'off')
    expectHeaderEquals(response, 'x-frame-options', 'SAMEORIGIN')
  })

  it('decorates app with sensible httpErrors helper', async () => {
    const app = await buildWithConfig()

    expect(app.httpErrors).toBeDefined()
    expect(typeof app.httpErrors.badRequest).toBe('function')
  })

  it('exposes health route returning uptime payload', async () => {
    const app = await buildWithConfig()

    const response = await app.inject({ method: 'GET', url: '/v1/health' })
    const body = response.json() as { ok: boolean; uptime: number }

    expect(response.statusCode).toBe(200)
    expect(body).toEqual({ ok: true, uptime: expect.any(Number) })
    expect(body.uptime).toBeGreaterThanOrEqual(0)
  })

  it('enforces AJV removeAdditional policy', async () => {
    const app = await buildWithConfig()

    app.route({
      handler: (request) => request.body,
      method: 'POST',
      schema: {
        body: {
          additionalProperties: false,
          properties: { foo: { type: 'string' } },
          required: ['foo'],
          type: 'object'
        }
      } as const,
      url: '/strict'
    })

    const response = await app.inject({
      method: 'POST',
      payload: { foo: 'bar', extra: 'nope' },
      url: '/strict'
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ foo: 'bar' })
  })

  it('executes onRequest hooks before the route handler', async () => {
    const app = await buildWithConfig()
    const requestFlags = new WeakMap<FastifyRequest, string>()

    app.addHook('onRequest', async (request) => {
      requestFlags.set(request, request.id)
    })

    app.get('/hook-order', async (request) => {
      expect(requestFlags.has(request)).toBe(true)
      expect(requestFlags.get(request)).toBe(request.id)
      return { seen: true }
    })

    const response = await app.inject({ method: 'GET', url: '/hook-order' })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ seen: true })
  })

  it('builds logger via buildLogger and wires it to Fastify instance', async () => {
    const loggerModule = await import('../core/logger/buildLogger')
    const fakeLogger = {
      child: vi.fn().mockReturnThis(),
      debug: vi.fn(),
      fatal: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      trace: vi.fn(),
      warn: vi.fn()
    }
    const loggerSpy = vi
      .spyOn(loggerModule, 'buildLogger')
      .mockReturnValue(fakeLogger as unknown as ReturnType<(typeof loggerModule)['buildLogger']>)

    const app = await buildApp({ config: baseConfig })
    activeApps.push(app)

    expect(loggerSpy).toHaveBeenCalledWith({
      level: baseConfig.LOG_LEVEL,
      nodeEnv: baseConfig.NODE_ENV
    })
    expect(app.log).toBe(fakeLogger)
  })

  it('creates independent app instances on repeated invocations', async () => {
    const appOne = await buildWithConfig({ PORT: 1111 })
    const appTwo = await buildWithConfig({ PORT: 2222 })

    appOne.decorate('uniqueFlag', true)

    expect(appOne).not.toBe(appTwo)
    expect((appTwo as Record<string, unknown>).uniqueFlag).toBeUndefined()
  })
})
