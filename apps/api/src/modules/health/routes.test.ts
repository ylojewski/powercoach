export {}

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

    expect(route).toHaveBeenCalledTimes(1)

    const firstCall = route.mock.calls[0]
    if (!firstCall) {
      throw new Error('health route was not registered')
    }

    const [config] = firstCall as [
      {
        handler: () => Promise<unknown>
        method: string
        schema: { response: { 200: { $ref: string } } }
        url: string
      }
    ]
    const { handler } = config

    expect(config).toStrictEqual({
      handler,
      method: 'GET',
      schema: {
        response: {
          200: { $ref: `${HEALTH_RESPONSE_SCHEMA_ID}#` }
        }
      },
      url: '/'
    })
    expect(await handler()).toEqual(healthStatus)
    expect(getHealthStatus).toHaveBeenCalled()
  })
})
