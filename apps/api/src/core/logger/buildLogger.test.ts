const pinoInstance = { level: '', options: {} as Record<string, unknown> }

const pinoMock = vi.fn((options: unknown) => {
  pinoInstance.options = options as Record<string, unknown>
  return { options }
})

vi.mock('pino', () => ({
  default: pinoMock
}))

describe('buildLogger', () => {
  beforeEach(() => {
    pinoMock.mockClear()
  })

  it('creates a production logger without transport', async () => {
    const { buildLogger } = await import('./buildLogger')

    buildLogger({ level: 'info', nodeEnv: 'production' })

    expect(pinoMock).toHaveBeenCalledWith({
      level: 'info',
      redact: {
        censor: '[REDACTED]',
        paths: ['req.headers.authorization', 'req.headers.cookie']
      }
    })
    const [firstCall] = pinoMock.mock.calls
    if (!firstCall) {
      throw new Error('pino should have been invoked')
    }
    const [options] = firstCall
    expect(options).not.toHaveProperty('transport')
  })

  it('enables pretty transport outside production', async () => {
    const { buildLogger } = await import('./buildLogger')

    buildLogger({ level: 'debug', nodeEnv: 'development' })

    expect(pinoMock).toHaveBeenCalledWith({
      level: 'debug',
      redact: {
        censor: '[REDACTED]',
        paths: ['req.headers.authorization', 'req.headers.cookie']
      },
      transport: {
        options: {
          colorize: true,
          translateTime: 'SYS:standard'
        },
        target: 'pino-pretty'
      }
    })
  })
})
