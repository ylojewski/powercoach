const registerHealthRoutes = vi.fn()

vi.mock('./routes', () => ({
  registerHealthRoutes
}))

describe('healthModule', () => {
  afterAll(() => {
    vi.resetModules()
  })

  it('adds schema and registers routes', async () => {
    const { healthResponseSchema } = await import('./schemas')
    const { healthModule } = await import('./module')
    const addSchema = vi.fn()
    const app = { addSchema }

    await healthModule(app as never, {})

    expect(addSchema).toHaveBeenCalledWith(healthResponseSchema)
    expect(registerHealthRoutes).toHaveBeenCalledWith(app)
  })
})
