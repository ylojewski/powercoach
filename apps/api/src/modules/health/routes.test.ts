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

    const [[config]] = route.mock.calls
    const { handler, method, schema, url } = config

    expect(method).toBe('GET')
    expect(url).toBe('/')
    expect(schema).toStrictEqual({
      response: {
        200: { $ref: `${HEALTH_RESPONSE_SCHEMA_ID}#` }
      }
    })
    expect(await handler()).toEqual(healthStatus)
    expect(getHealthStatus).toHaveBeenCalled()
  })
})
