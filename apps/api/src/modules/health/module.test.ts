import { mockQueryResult } from '@powercoach/util-test'
import { type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { type FastifyInstance } from 'fastify'
import { type MockedFunction } from 'vitest'

import { type IsOkQueryRow } from '@/src/repositories'
import { buildDummyApp } from '@/test/utils'

import { HEALTH_MODULE_NAME, healthModule } from './module'
import { HEALTH_RESPONSE_SCHEMA_ID, type HealthResponse, healthResponseSchema } from './schemas'
import * as service from './service'

describe('healthModule', () => {
  let dummyApp: FastifyInstance
  let executeMock: MockedFunction<NodePgDatabase['execute']>

  beforeAll(async () => {
    vi.spyOn(service, 'getHealthStatus')
    dummyApp = await buildDummyApp({
      plugins: [healthModule],
      spies: ['addSchema', 'route'],
      withDb: true
    })
    executeMock = dummyApp.db.execute as MockedFunction<NodePgDatabase['execute']>
  })

  afterAll(async () => {
    vi.resetAllMocks()
    await dummyApp.close()
  })

  it('exposes a custom module name', () => {
    expect(HEALTH_MODULE_NAME).toBe('powercoach.health.module')
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
          response: expect.objectContaining({
            200: expect.objectContaining(healthResponseSchema)
          })
        }),
        url: '/'
      })
    )
  })

  it('returns a valid HealthResponse from the GET / route using the service', async () => {
    executeMock.mockResolvedValueOnce(mockQueryResult<IsOkQueryRow>([{ database: 1 }]))

    const response = await dummyApp.inject({ method: 'GET', url: '/' })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(service.getHealthStatus).toHaveBeenCalledTimes(1)

    const payload = response.json()

    expect(payload).toStrictEqual<HealthResponse>({
      database: true,
      live: true,
      ready: true,
      uptime: expect.any(Number)
    })
    expect(payload.uptime).toBeGreaterThanOrEqual(0)
  })
})
