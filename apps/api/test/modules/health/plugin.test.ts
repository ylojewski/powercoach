import { beforeEach, describe, expect, it, vi } from 'vitest'

const registerHealthRoutes = vi.fn()

vi.mock('../../../src/modules/health/routes', () => ({
  registerHealthRoutes
}))

const { healthResponseSchema } = await import('../../../src/modules/health/schemas')

describe('healthModule', () => {
  beforeEach(() => {
    registerHealthRoutes.mockClear()
  })

  it('adds schema and registers routes', async () => {
    const { healthModule } = await import('../../../src/modules/health/plugin')
    const addSchema = vi.fn()
    const app = { addSchema }

    await healthModule(app as never)

    expect(addSchema).toHaveBeenCalledWith(healthResponseSchema)
    expect(registerHealthRoutes).toHaveBeenCalledWith(app)
  })
})
