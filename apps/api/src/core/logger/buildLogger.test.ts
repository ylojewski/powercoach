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

  it('redacts sensitive headers and payload fields', () => {
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
    expect(entry.req.headers.authorization).toBe('[REDACTED]')
    expect(entry.req.headers.cookie).toBe('[REDACTED]')
    expect(entry.req.headers['x-api-key']).toBe('[REDACTED]')
    expect(entry.req.body.password).toBe('[REDACTED]')
    expect(entry.req.body.token).toBe('[REDACTED]')
    expect(entry.req.body.access_token).toBe('[REDACTED]')
    expect(entry.req.body.refresh_token).toBe('[REDACTED]')
    expect(entry.req.headers['set-cookie']).toBe('[REDACTED]')
    expect(entry.res.headers['set-cookie']).toBe('[REDACTED]')
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
    expect(parsed.req.headers.authorization).toBe('[REDACTED]')
    expect(parsed.req.body.password).toBe('[REDACTED]')
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
    expect(parsed.req.headers.authorization).toBe('[REDACTED]')
    expect(parsed.ctx).toBe('child')
  })
})
