import { stubEnv } from '@test/utils/env'
import { AppConfig } from '@/core'
import { LOG_LEVEL, NODE_ENV } from '@/types/env.d'

vi.mock('dotenv', () => ({
  config: vi.fn()
}))

describe('loadConfig', () => {
  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  it('loads configuration from process.env', async () => {
    stubEnv({
      HOST: '127.0.0.1',
      LOG_LEVEL: LOG_LEVEL.info,
      NODE_ENV: NODE_ENV.production,
      PORT: 4000
    })

    const dotenv = await import('dotenv')
    const { loadConfig } = await import('./loadConfig')

    expect(loadConfig()).toStrictEqual({
      HOST: '127.0.0.1',
      LOG_LEVEL: LOG_LEVEL.info,
      NODE_ENV: NODE_ENV.production,
      PORT: 4000
    })
    expect(dotenv.config).toHaveBeenCalledTimes(1)
  })

  it('uses cached configuration on subsequent calls', async () => {
    stubEnv({
      HOST: '127.0.0.1',
      LOG_LEVEL: LOG_LEVEL.info,
      NODE_ENV: NODE_ENV.production,
      PORT: 4000
    })

    const dotenv = await import('dotenv')
    const { loadConfig } = await import('./loadConfig')

    const first = loadConfig()
    const second = loadConfig()

    expect(first).toBe(second)
    expect(second).toStrictEqual<AppConfig>({
      HOST: '127.0.0.1',
      LOG_LEVEL: LOG_LEVEL.info,
      NODE_ENV: NODE_ENV.production,
      PORT: 4000
    })
    expect(dotenv.config).toHaveBeenCalledTimes(1)
  })

  it('throws when validation fails', async () => {
    stubEnv({
      PORT: 70000
    })

    const { loadConfig } = await import('./loadConfig')

    expect(() => loadConfig()).toThrowError(/Invalid environment configuration/i)
  })
})
