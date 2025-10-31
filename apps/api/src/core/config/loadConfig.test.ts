vi.mock('dotenv', () => ({
  config: vi.fn()
}))

const envModulePath = './loadConfig'

describe('loadConfig', () => {
  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('loads configuration from process.env by default', async () => {
    const original = {
      HOST: process.env.HOST,
      LOG_LEVEL: process.env.LOG_LEVEL,
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT
    }

    process.env.HOST = 'localhost'
    process.env.LOG_LEVEL = 'info'
    process.env.NODE_ENV = 'production'
    process.env.PORT = '4000'

    const dotenv = await import('dotenv')
    const { loadConfig } = await import(envModulePath)

    expect(loadConfig()).toEqual({
      HOST: 'localhost',
      LOG_LEVEL: 'info',
      NODE_ENV: 'production',
      PORT: 4000
    })
    expect(dotenv.config).toHaveBeenCalledTimes(1)

    if (original.HOST === undefined) {
      delete process.env.HOST
    } else {
      process.env.HOST = original.HOST
    }

    if (original.LOG_LEVEL === undefined) {
      delete process.env.LOG_LEVEL
    } else {
      process.env.LOG_LEVEL = original.LOG_LEVEL
    }

    if (original.NODE_ENV === undefined) {
      delete process.env.NODE_ENV
    } else {
      process.env.NODE_ENV = original.NODE_ENV
    }

    if (original.PORT === undefined) {
      delete process.env.PORT
    } else {
      process.env.PORT = original.PORT
    }
  })

  it('loads configuration using provided environment variables', async () => {
    const { loadConfig } = await import(envModulePath)

    const result = loadConfig({
      HOST: '127.0.0.1',
      LOG_LEVEL: 'debug',
      NODE_ENV: 'production',
      PORT: '8080'
    })

    expect(result).toEqual({
      HOST: '127.0.0.1',
      LOG_LEVEL: 'debug',
      NODE_ENV: 'production',
      PORT: 8080
    })
  })

  it('uses cached configuration on subsequent calls', async () => {
    const dotenv = await import('dotenv')
    const { loadConfig } = await import(envModulePath)

    const first = loadConfig({
      HOST: 'localhost',
      LOG_LEVEL: 'info',
      NODE_ENV: 'development',
      PORT: '3000'
    })

    const second = loadConfig({
      HOST: 'should-not-change',
      LOG_LEVEL: 'error',
      NODE_ENV: 'test',
      PORT: '4000'
    })

    expect(first).toBe(second)
    expect(second).toEqual({
      HOST: 'localhost',
      LOG_LEVEL: 'info',
      NODE_ENV: 'development',
      PORT: 3000
    })
    expect(dotenv.config).toHaveBeenCalledTimes(1)
  })

  it('throws when validation fails', async () => {
    const { loadConfig } = await import(envModulePath)

    expect(() =>
      loadConfig({
        HOST: '',
        LOG_LEVEL: 'invalid',
        NODE_ENV: 'unknown',
        PORT: '-1'
      })
    ).toThrowError(/Invalid environment configuration/)
  })
})
