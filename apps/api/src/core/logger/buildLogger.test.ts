import { NodeEnv } from '@/src/types'

const pinoSpy = vi.fn()

vi.mock('pino', () => ({
  default: pinoSpy
}))

describe('buildLogger', () => {
  beforeEach(() => {
    pinoSpy.mockClear()
  })

  it('censors critical paths', async () => {
    const { buildLogger } = await import('./buildLogger')

    buildLogger({
      level: 'info',
      nodeEnv: NodeEnv.production
    })

    expect(pinoSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        redact: expect.objectContaining({
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'req.body.token',
            'req.body.refreshToken',
            'req.query.*token*',
            'res.headers.set-cookie'
          ]
        })
      })
    )
  })

  it('creates a production logger without transport', async () => {
    const { buildLogger, censoredPaths } = await import('./buildLogger')

    buildLogger({
      level: 'info',
      nodeEnv: NodeEnv.production
    })

    expect(pinoSpy).toHaveBeenCalledExactlyOnceWith({
      level: 'info',
      redact: {
        censor: '[REDACTED]',
        paths: censoredPaths
      }
    })
    expect(pinoSpy).not.toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        transport: expect.anything()
      })
    )
  })

  it('enables pretty transport outside production', async () => {
    const { buildLogger } = await import('./buildLogger')

    buildLogger({
      level: 'debug',
      nodeEnv: NodeEnv.development
    })

    expect(pinoSpy).toHaveBeenCalledTimes(1)
    const [options] = pinoSpy.mock.calls[0] as [Record<string, unknown>]
    expect(options).toMatchObject({
      level: 'debug',
      transport: {
        options: {
          colorize: true,
          translateTime: 'SYS:standard'
        },
        target: 'pino-pretty'
      }
    })
    expect(options).not.toHaveProperty('redact')
  })

  it('disables redaction in development', async () => {
    const { buildLogger } = await import('./buildLogger')

    buildLogger({
      level: 'info',
      nodeEnv: NodeEnv.development
    })

    expect(pinoSpy).toHaveBeenCalledTimes(1)
    const [options] = pinoSpy.mock.calls[0] as [Record<string, unknown>]
    expect(options).not.toHaveProperty('redact')
  })
})
