import Fastify from 'fastify'

const sensibleMock = vi.fn()

vi.mock('@fastify/sensible', () => ({
  default: sensibleMock
}))

describe('sensiblePlugin', () => {
  it('registers the sensible plugin', async () => {
    const { sensiblePlugin } = await import('./sensible.plugin')
    const app = Fastify()

    try {
      await app.register(sensiblePlugin)

      expect(sensibleMock).toHaveBeenCalledTimes(1)
      expect(sensibleMock.mock.calls[0][1]).toEqual({})
    } finally {
      await app.close()
    }
  })
})
