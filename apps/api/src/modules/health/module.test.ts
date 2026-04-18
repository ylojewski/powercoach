import { type FastifyInstance } from 'fastify'
import { type MockedFunction } from 'vitest'

import { REQUEST_MODULE_NAME } from '@/src/app'
import { buildDummyApp } from '@/test/utils'

import { HEALTH_MODULE_NAME, HEALTH_MODULE_TAG, healthModule } from './module'
import { HEALTH_RESPONSE_SCHEMA_ID, type HealthResponse, healthResponseSchema } from './schemas'
import * as service from './service'

describe('healthModule', () => {
  let dummyApp: FastifyInstance
  let getHealthStatusMock: MockedFunction<typeof service.getHealthStatus>

  beforeAll(async () => {
    getHealthStatusMock = vi.spyOn(service, 'getHealthStatus')
    dummyApp = await buildDummyApp({
      plugins: [healthModule],
      spies: ['addSchema', 'route'],
      withDb: true
    })
  })

  afterAll(async () => {
    vi.resetAllMocks()
    await dummyApp.close()
  })

  it('exposes a custom name and tags', () => {
    expect(HEALTH_MODULE_NAME).toBe('powercoach.health.module')
    expect(HEALTH_MODULE_TAG).toBe('health')
  })

  it('add the HealthResponse schema', () => {
    expect(dummyApp.addSchema).toHaveBeenCalledOnce()
    expect(dummyApp.addSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        $id: HEALTH_RESPONSE_SCHEMA_ID,
        additionalProperties: false,
        properties: expect.objectContaining({
          database: expect.objectContaining({ type: 'boolean' }),
          live: expect.objectContaining({ type: 'boolean' }),
          ready: expect.objectContaining({ type: 'boolean' }),
          uptime: expect.objectContaining({ minimum: 0, type: 'number' })
        }),
        required: ['database', 'live', 'ready', 'uptime']
      })
    )
  })

  it('registers the GET / route using the HealthResponse schema', () => {
    expect(dummyApp.route).toHaveBeenCalledTimes(1)
    expect(dummyApp.route).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        schema: expect.objectContaining({
          operationId: 'getHealthStatus',
          response: expect.objectContaining({
            200: expect.objectContaining(healthResponseSchema)
          }),
          tags: [HEALTH_MODULE_TAG]
        }),
        url: '/'
      })
    )
  })

  it('returns a valid HealthResponse from the GET / route using the service', async () => {
    const healthResponse: HealthResponse = {
      database: true,
      live: true,
      ready: true,
      uptime: 123
    }

    getHealthStatusMock.mockResolvedValueOnce(healthResponse)

    const response = await dummyApp.inject({ method: 'GET', url: '/' })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.headers[REQUEST_MODULE_NAME]).toBe(HEALTH_MODULE_NAME)
    expect(service.getHealthStatus).toHaveBeenCalledTimes(1)

    expect(response.json()).toStrictEqual<HealthResponse>(healthResponse)
  })
})
