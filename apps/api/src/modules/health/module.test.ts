import { FastifyInstance } from 'fastify'

import { buildDummyApp } from '@/test/utils'

import { HEALTH_MODULE_NAME, healthModule } from './module'
import { HEALTH_RESPONSE_SCHEMA_ID, healthResponseSchema } from './schemas'
import * as service from './service'

describe('healthModule', () => {
  let dummyApp: FastifyInstance

  beforeAll(async () => {
    vi.spyOn(service, 'getHealthStatus')
    dummyApp = await buildDummyApp({
      spies: ['addSchema', 'route'],
      plugins: [healthModule]
    })
  })

  afterAll(async () => {
    vi.resetAllMocks()
    await dummyApp.close()
  })

  it('exposes a custom name', () => {
    expect(HEALTH_MODULE_NAME).toBe('powercoach.health.module')
  })

  it('add the HealthResponse schema', () => {
    expect(dummyApp.addSchema).toHaveBeenCalledOnce()
    expect(dummyApp.addSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        $id: HEALTH_RESPONSE_SCHEMA_ID,
        additionalProperties: false,
        properties: expect.objectContaining({
          ok: expect.objectContaining({ type: 'boolean' }),
          uptime: expect.objectContaining({ minimum: 0, type: 'number' })
        }),
        required: ['ok', 'uptime']
      })
    )
  })

  it('registers the GET / route using the HealthResponse schema', () => {
    expect(dummyApp.route).toHaveBeenCalledTimes(1)
    expect(dummyApp.route).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        schema: expect.objectContaining({
          response: expect.objectContaining({
            200: expect.objectContaining(healthResponseSchema)
          })
        }),
        url: '/'
      })
    )
  })

  it('returns a valid HealthResponse from the GET / route using the service', async () => {
    const response = await dummyApp.inject({ method: 'GET', url: '/' })

    expect(response.statusCode).toBe(200)
    expect(service.getHealthStatus).toHaveBeenCalledOnce()
    expect(response.headers['content-type']).toMatch(/application\/json/)

    const payload = response.json()

    expect(payload.uptime).toBeGreaterThanOrEqual(0)
    expect(payload).toStrictEqual({
      ok: true,
      uptime: expect.any(Number)
    })
  })
})
