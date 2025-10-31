import { createTestApp } from '@test/setup'
import type { AppFastifyInstance } from '@/app'
import '../../index'
import '../../server'

vi.mock('@fastify/helmet', () => ({
  default: vi.fn(async () => undefined)
}))

vi.mock('@fastify/sensible', () => ({
  default: vi.fn(async () => undefined)
}))

vi.mock('fastify-plugin', () => ({
  default: (plugin: unknown) => plugin
}))

describe('GET /v1/health', () => {
  let app: AppFastifyInstance

  beforeAll(async () => {
    app = await createTestApp()
  })

  afterAll(async () => {
    await app.close()
  })

  it('returns an ok payload with uptime', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/health'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)

    const payload = response.json()
    expect(payload).toStrictEqual({
      ok: true,
      uptime: expect.any(Number)
    })
    expect(payload.uptime).toBeGreaterThanOrEqual(0)
  })
})
