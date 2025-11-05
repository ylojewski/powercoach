import { AppConfig } from '@src/core'
import { LogLevel, NodeEnv } from '@src/types'
import { productionConfig, testConfig } from '@test/fixtures/env'
import { stubEnv } from '@test/utils/env'
import { config } from 'dotenv'
import { loadConfig, resetCachedConfig } from './loadConfig'

vi.mock('dotenv', () => ({
  config: vi.fn()
}))

describe('loadConfig', () => {
  beforeEach(async () => {
    resetCachedConfig()
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  it('loads configuration from process.env', async () => {
    stubEnv({
      HOST: '127.0.0.1',
      LOG_LEVEL: LogLevel.info,
      NODE_ENV: NodeEnv.production,
      PORT: 4000
    })

    expect(loadConfig()).toStrictEqual<AppConfig>({
      HOST: '127.0.0.1',
      LOG_LEVEL: LogLevel.info,
      NODE_ENV: NodeEnv.production,
      PORT: 4000
    })
    expect(config).toHaveBeenCalledTimes(1)
  })

  it('uses cached configuration on subsequent calls', async () => {
    stubEnv({
      HOST: '127.0.0.1',
      LOG_LEVEL: LogLevel.info,
      NODE_ENV: NodeEnv.production,
      PORT: 4000
    })

    const first = loadConfig()
    const second = loadConfig()

    expect(first).toBe(second)
    expect(second).toStrictEqual<AppConfig>({
      HOST: '127.0.0.1',
      LOG_LEVEL: LogLevel.info,
      NODE_ENV: NodeEnv.production,
      PORT: 4000
    })
    expect(config).toHaveBeenCalledTimes(1)
  })

  it('should not reset cacheConfig', async () => {
    vi.resetModules()
    stubEnv(productionConfig)

    const productionModule = await import('./loadConfig')
    const first = productionModule.loadConfig()

    productionModule.resetCachedConfig()

    const second = productionModule.loadConfig()

    expect(first === second).toBe(true)
  })

  it('should reset cacheConfig', async () => {
    vi.resetModules()
    stubEnv(testConfig)

    const testModule = await import('./loadConfig')
    const first = testModule.loadConfig()

    testModule.resetCachedConfig()

    const second = testModule.loadConfig()

    expect(first === second).toBe(false)
  })

  it('throws when validation fails', async () => {
    stubEnv({ PORT: 70000 })
    expect(() => loadConfig()).toThrowError(/Invalid environment configuration/i)
  })
})
