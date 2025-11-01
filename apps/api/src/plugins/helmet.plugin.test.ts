import Fastify from 'fastify'
import type { AppConfig } from '../core'

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
    const config: AppConfig = {
      HOST: '0.0.0.0',
      LOG_LEVEL: 'info',
      NODE_ENV: 'development',
      PORT: 3000
    }
    app.decorate('config', config)

    try {
      await app.register(helmetPlugin)

      expect(helmetMock).toHaveBeenCalledTimes(1)
      const firstCall = helmetMock.mock.calls[0]
      if (!firstCall) {
        throw new Error('helmet should have been registered')
      }
      const [, options] = firstCall
      expect(options).toStrictEqual({
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
    const config: AppConfig = {
      HOST: '0.0.0.0',
      LOG_LEVEL: 'info',
      NODE_ENV: 'production',
      PORT: 3000
    }
    app.decorate('config', config)

    try {
      await app.register(helmetPlugin)

      expect(helmetMock).toHaveBeenCalledTimes(1)
      const firstCall = helmetMock.mock.calls[0]
      if (!firstCall) {
        throw new Error('helmet should have been registered')
      }
      const [, options] = firstCall
      expect(options).toStrictEqual({
        crossOriginEmbedderPolicy: false
      })
    } finally {
      await app.close()
    }
  })
})
