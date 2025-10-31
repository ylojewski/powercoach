import { describe, expect, it, vi } from 'vitest'

const healthStatus = { ok: true, uptime: 42 }

vi.mock('./service', () => ({
  getHealthStatus: vi.fn(() => healthStatus)
}))

const { getHealthStatus } = await import('./service')

const { HEALTH_RESPONSE_SCHEMA_ID } = await import('./schemas')

describe('registerHealthRoutes', () => {
  it('registers the health check route', async () => {
    const { registerHealthRoutes } = await import('./routes')
    const route = vi.fn()
    const app = { route }

    registerHealthRoutes(app as never)

    expect(route).toHaveBeenCalledWith({
      handler: expect.any(Function),
      method: 'GET',
      schema: {
        response: {
          200: { $ref: `${HEALTH_RESPONSE_SCHEMA_ID}#` }
        }
      },
      url: '/'
    })

    const { handler } = route.mock.calls[0][0]
    expect(await handler()).toEqual(healthStatus)
    expect(getHealthStatus).toHaveBeenCalled()
  })
})
