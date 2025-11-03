import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

const actualPinoPromise = vi.importActual<typeof import('pino')>('pino')

vi.mock('pino', async () => {
  const actual = await actualPinoPromise
  const defaultSpy = vi.fn(
    (
      options: Parameters<typeof actual.default>[0],
      destination?: Parameters<typeof actual.default>[1]
    ) => actual.default(options, destination)
  )

  return {
    ...actual,
    default: defaultSpy
  }
})

let pinoModule: Awaited<typeof actualPinoPromise>
let buildLogger: typeof import('./buildLogger').buildLogger

beforeAll(async () => {
  pinoModule = (await import('pino')) as Awaited<typeof actualPinoPromise>
  ;({ buildLogger } = await import('./buildLogger'))
})

afterEach(() => {
  vi.clearAllMocks()
})

function createDestination() {
  const destination = pinoModule.destination({ sync: true })
  const logs: string[] = []
  const writeSpy = vi.spyOn(destination, 'write').mockImplementation((chunk: string | Buffer) => {
    logs.push(chunk.toString())
    return true
  })

  return {
    destination,
    logs,
    restore: () => {
      writeSpy.mockRestore()
      destination.end()
    }
  }
}

describe('buildLogger', () => {
  it('creates a logger with the requested level', () => {
    const { destination, restore } = createDestination()
    const logger = buildLogger({ level: 'debug', nodeEnv: 'production', destination })

    expect(logger.level).toBe('debug')

    restore()
  })

  it('enables pretty transport outside production', () => {
    const spy = pinoModule.default as ReturnType<typeof vi.fn>

    buildLogger({ level: 'info', nodeEnv: 'development' })
    expect(spy).toHaveBeenCalled()
    const [optionsDev] = spy.mock.calls.at(-1) ?? []
    expect(optionsDev).toMatchObject({
      level: 'info',
      transport: {
        options: { colorize: true, translateTime: 'SYS:standard' },
        target: 'pino-pretty'
      }
    })

    buildLogger({ level: 'info', nodeEnv: 'production' })
    const [optionsProd] = spy.mock.calls.at(-1) ?? []
    expect(optionsProd).toMatchObject({ level: 'info' })
    expect(optionsProd).not.toHaveProperty('transport')
  })

  it('removes sensitive headers and payload fields', () => {
    const { destination, logs, restore } = createDestination()
    const logger = buildLogger({ level: 'info', nodeEnv: 'production', destination })

    logger.info({
      req: {
        body: {
          access_token: 'access',
          password: 'secret',
          refresh_token: 'refresh',
          token: 'token'
        },
        headers: {
          authorization: 'Bearer token',
          cookie: 'session=abc',
          'set-cookie': 'tracking=true',
          'x-api-key': 'apikey'
        }
      },
      res: {
        headers: {
          'set-cookie': ['sensitive']
        }
      }
    })

    logger.flush()
    restore()

    interface LoggedEntry {
      req: { headers: Record<string, unknown>; body: Record<string, unknown> }
      res: { headers: Record<string, unknown> }
    }
    const entry = JSON.parse((logs.at(-1) ?? '').trim() || '{}') as LoggedEntry
    expect(entry.req.headers).not.toHaveProperty('authorization')
    expect(entry.req.headers).not.toHaveProperty('cookie')
    expect(entry.req.headers).not.toHaveProperty('x-api-key')
    expect(entry.req.headers).not.toHaveProperty('set-cookie')
    expect(entry.req.body).not.toHaveProperty('password')
    expect(entry.req.body).not.toHaveProperty('token')
    expect(entry.req.body).not.toHaveProperty('access_token')
    expect(entry.req.body).not.toHaveProperty('refresh_token')
    expect(entry.res.headers).not.toHaveProperty('set-cookie')
  })

  it('emits parseable JSON without leaking secrets in production', () => {
    const { destination, logs, restore } = createDestination()
    const logger = buildLogger({ level: 'info', nodeEnv: 'production', destination })

    logger.info({
      message: 'hello',
      req: {
        body: { password: 'sensitive' },
        headers: { authorization: 'token' }
      }
    })

    logger.flush()
    restore()

    const payload = logs.at(-1)
    expect(payload).toBeDefined()
    interface ParsedEntry {
      req: { headers: Record<string, unknown>; body: Record<string, unknown> }
    }
    const parsed = JSON.parse((payload ?? '').trim() || '{}') as ParsedEntry
    expect(parsed.req.headers).not.toHaveProperty('authorization')
    expect(parsed.req.body).not.toHaveProperty('password')
  })

  it('retains redaction and level on child loggers', () => {
    const { destination, logs, restore } = createDestination()
    const logger = buildLogger({ level: 'warn', nodeEnv: 'production', destination })

    const child = logger.child({ ctx: 'child' })
    expect(child.level).toBe('warn')

    child.warn({ req: { headers: { authorization: 'secret' } } })
    logger.flush()
    restore()

    interface ChildEntry {
      ctx: string
      req: { headers: Record<string, unknown> }
    }
    const parsed = JSON.parse((logs.at(-1) ?? '').trim() || '{}') as ChildEntry
    expect(parsed.req.headers).not.toHaveProperty('authorization')
    expect(parsed.ctx).toBe('child')
  })

  it('writes compact JSON logs in production without pretty transport', () => {
    const { destination, logs, restore } = createDestination()
    const logger = buildLogger({ level: 'info', nodeEnv: 'production', destination })

    logger.info({ message: 'plain' })
    logger.flush()
    restore()

    const payload = logs.at(-1) ?? ''
    expect(() => JSON.parse(payload)).not.toThrow()
    expect(payload.trim().startsWith('{')).toBe(true)
    expect(payload.includes('\u001b')).toBe(false)
  })

  it('fully removes redacted keys when remove:true is configured', () => {
    const { destination, logs, restore } = createDestination()
    const logger = buildLogger({ level: 'info', nodeEnv: 'production', destination })

    logger.info({
      password: 'secret',
      token: 'value',
      access_token: 'a',
      refresh_token: 'b',
      'set-cookie': 'a=b'
    })

    logger.flush()
    restore()

    const parsed = JSON.parse((logs.at(-1) ?? '').trim() || '{}') as Record<string, unknown>
    expect(parsed).not.toHaveProperty('password')
    expect(parsed).not.toHaveProperty('token')
    expect(parsed).not.toHaveProperty('access_token')
    expect(parsed).not.toHaveProperty('refresh_token')
    expect(parsed).not.toHaveProperty('set-cookie')
  })
})
