const registerHealthRoutes = vi.fn()

vi.mock('./routes', () => ({
  registerHealthRoutes
}))

const { healthResponseSchema } = await import('./schemas')

describe('healthModule', () => {
  beforeEach(() => {
    registerHealthRoutes.mockClear()
  })

  it('adds schema and registers routes', async () => {
    const { healthModule } = await import('./plugin')
    const addSchema = vi.fn()
    const app = { addSchema }

    await healthModule(app as never)

    expect(addSchema).toHaveBeenCalledWith(healthResponseSchema)
    expect(registerHealthRoutes).toHaveBeenCalledWith(app)
  })
})
