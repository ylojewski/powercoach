import Fastify from 'fastify'

const helmetMock = vi.fn()

vi.mock('@fastify/helmet', () => ({
  default: helmetMock
}))

describe('helmetPlugin', () => {
  beforeEach(() => {
    helmetMock.mockClear()
  })

  it('registers helmet with relaxed CSP outside production', async () => {
    const { helmetPlugin } = await import('./helmet.plugin')
    const app = Fastify()
    app.decorate('config', { NODE_ENV: 'development' })

    try {
      await app.register(helmetPlugin)

      expect(helmetMock).toHaveBeenCalledTimes(1)
      expect(helmetMock.mock.calls[0][1]).toStrictEqual({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
      })
    } finally {
      await app.close()
    }
  })

  it('registers helmet without overriding CSP in production', async () => {
    const { helmetPlugin } = await import('./helmet.plugin')
    const app = Fastify()
    app.decorate('config', { NODE_ENV: 'production' })

    try {
      await app.register(helmetPlugin)

      expect(helmetMock).toHaveBeenCalledTimes(1)
      expect(helmetMock.mock.calls[0][1]).toStrictEqual({
        crossOriginEmbedderPolicy: false
      })
    } finally {
      await app.close()
    }
  })
})
