import { AppFastifyInstance } from '@src/app'
import { buildDummyApp, buildTestApp } from '@test/utils/app'
import { FastifyInstance } from 'fastify'
import { HEALTH_MODULE_NAME, healthModule } from './module'
import { HEALTH_RESPONSE_SCHEMA_ID, healthResponseSchema } from './schemas'
import * as service from './service'

describe('healthModule', () => {
  describe('when registered on a dummy instance', () => {
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

    it('handles the GET / route response using the service', async () => {
      const response = await dummyApp.inject({ method: 'GET', url: '/' })

      expect(response.statusCode).toBe(200)
      expect(service.getHealthStatus).toHaveBeenCalledOnce()
    })
  })

  describe('when registered on the test instance', () => {
    let testApp: AppFastifyInstance

    beforeAll(async () => {
      testApp = await buildTestApp()
    })

    afterAll(async () => {
      await testApp.close()
    })

    it('returns a valid HealthResponse schema payload from /v1/health', async () => {
      const response = await testApp.inject({ method: 'GET', url: '/v1/health' })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toMatch(/application\/json/)

      const payload = response.json()

      expect(payload.uptime).toBeGreaterThanOrEqual(0)
      expect(payload).toStrictEqual({
        ok: true,
        uptime: expect.any(Number)
      })
    })
  })
})
