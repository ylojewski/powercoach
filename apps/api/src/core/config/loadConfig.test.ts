import process from 'node:process'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('dotenv', () => ({
  config: vi.fn(() => ({ parsed: {} }))
}))

const modulePath = './loadConfig'

describe('loadConfig', () => {
  beforeEach(async () => {
    vi.resetModules()
  })

  const prepareEnv = (env: Record<string, string>) => {
    for (const [key, value] of Object.entries(env)) {
      process.env[key] = value
    }
  }

  it('returns cached frozen configuration across calls', async () => {
    const { loadConfig } = await import(modulePath)
    const env = {
      HOST: 'localhost',
      LOG_LEVEL: 'warn',
      NODE_ENV: 'production',
      PORT: '1234'
    }

    const first = loadConfig(env)
    const second = loadConfig(env)

    expect(first).toBe(second)
    expect(Object.isFrozen(first)).toBe(true)
    expect(first).toEqual({
      HOST: 'localhost',
      LOG_LEVEL: 'warn',
      NODE_ENV: 'production',
      PORT: 1234
    })
  })

  it('invokes dotenv.config and respects existing process.env values', async () => {
    const { loadConfig } = await import(modulePath)
    const dotenv = await import('dotenv')
    const configMock = vi.mocked(dotenv.config)

    prepareEnv({ HOST: '0.0.0.0', LOG_LEVEL: 'error', NODE_ENV: 'development', PORT: '9999' })

    const result = loadConfig()

    expect(configMock).toHaveBeenCalled()
    expect(result.PORT).toBe(9999)
    expect(result.LOG_LEVEL).toBe('error')
  })

  it('does not override existing process.env values with dotenv parsed output', async () => {
    const { loadConfig } = await import(modulePath)
    const dotenv = await import('dotenv')
    const configMock = vi.mocked(dotenv.config)
    configMock.mockReturnValueOnce({ parsed: { PORT: '9999' } })

    const previous = {
      HOST: process.env.HOST,
      LOG_LEVEL: process.env.LOG_LEVEL,
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT
    }

    process.env.HOST = '127.0.0.1'
    process.env.LOG_LEVEL = 'info'
    process.env.NODE_ENV = 'development'
    process.env.PORT = '3456'

    try {
      const config = loadConfig()

      expect(configMock).toHaveBeenCalled()
      expect(config.PORT).toBe(3456)
    } finally {
      if (previous.HOST === undefined) {
        delete process.env.HOST
      } else {
        process.env.HOST = previous.HOST
      }

      if (previous.LOG_LEVEL === undefined) {
        delete process.env.LOG_LEVEL
      } else {
        process.env.LOG_LEVEL = previous.LOG_LEVEL
      }

      if (previous.NODE_ENV === undefined) {
        delete process.env.NODE_ENV
      } else {
        process.env.NODE_ENV = previous.NODE_ENV
      }

      if (previous.PORT === undefined) {
        delete process.env.PORT
      } else {
        process.env.PORT = previous.PORT
      }
    }
  })

  it('validates environment and throws descriptive error when invalid', async () => {
    const { loadConfig } = await import(modulePath)

    expect(() =>
      loadConfig({
        HOST: '',
        LOG_LEVEL: 'trace',
        NODE_ENV: 'development',
        PORT: '-1'
      })
    ).toThrowError('[config] Invalid environment:')
  })

  it('produces typed configuration when validation succeeds', async () => {
    const { loadConfig } = await import(modulePath)

    const config = loadConfig({
      HOST: '127.0.0.1',
      LOG_LEVEL: 'debug',
      NODE_ENV: 'test',
      PORT: '8080'
    })

    expect(config).toEqual({ HOST: '127.0.0.1', LOG_LEVEL: 'debug', NODE_ENV: 'test', PORT: 8080 })
  })

  it('never calls process.exit', async () => {
    const { loadConfig } = await import(modulePath)
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never)

    const config = loadConfig({
      HOST: '127.0.0.1',
      LOG_LEVEL: 'info',
      NODE_ENV: 'development',
      PORT: '3000'
    })

    expect(config.HOST).toBe('127.0.0.1')
    expect(exitSpy).not.toHaveBeenCalled()
  })

  it('returns the same instance for concurrent calls', async () => {
    const { loadConfig } = await import(modulePath)
    const env = {
      HOST: 'localhost',
      LOG_LEVEL: 'info',
      NODE_ENV: 'test',
      PORT: '4000'
    }

    const [configA, configB] = await Promise.all([loadConfig(env), loadConfig(env)])

    expect(configA).toBe(configB)
  })
})
