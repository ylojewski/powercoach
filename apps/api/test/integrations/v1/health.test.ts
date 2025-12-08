import { type HealthResponse } from '@/src/modules'
import { appTest } from '@/test/utils'

describe('/v1/health', () => {
  appTest('is ok', async ({ app }) => {
    const response = await app.inject({ method: 'GET', url: '/v1/health' })
    const payload = response.json()

    expect(response.statusCode).toBe(200)
    expect(payload).toStrictEqual<HealthResponse>({
      database: true,
      live: true,
      ready: true,
      uptime: expect.any(Number)
    })
    expect(payload.uptime).toBeGreaterThanOrEqual(0)
  })
})
