import { config } from 'dotenv'

import { Env } from '@/src/core'
import { NodeEnv } from '@/src/types'
import { productionConfig, testConfig } from '@/test/fixtures'
import { stubEnv } from '@/test/utils'

import { loadEnv, resetCachedConfig } from './loadEnv'

vi.mock('dotenv', () => ({
  config: vi.fn()
}))

describe('loadEnv', () => {
  beforeEach(async () => {
    resetCachedConfig()
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  it('loads configuration from process.env', async () => {
    stubEnv({
      DATABASE_URL:
        'postgresql://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require',
      NODE_ENV: NodeEnv.production
    })

    expect(loadEnv()).toStrictEqual<Env>({
      DATABASE_URL:
        'postgresql://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require',
      NODE_ENV: NodeEnv.production
    })
    expect(config).toHaveBeenCalledTimes(1)
  })

  it('uses cached configuration on subsequent calls', async () => {
    stubEnv({
      DATABASE_URL:
        'postgresql://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require',
      NODE_ENV: NodeEnv.production
    })

    const first = loadEnv()
    const second = loadEnv()

    expect(first).toBe(second)
    expect(second).toStrictEqual<Env>({
      DATABASE_URL:
        'postgresql://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require',
      NODE_ENV: NodeEnv.production
    })
    expect(config).toHaveBeenCalledTimes(1)
  })

  it('should not reset cacheConfig', async () => {
    vi.resetModules()
    stubEnv(productionConfig)

    const productionModule = await import('./loadEnv')
    const first = productionModule.loadEnv()

    productionModule.resetCachedConfig()

    const second = productionModule.loadEnv()

    expect(first === second).toBe(true)
  })

  it('should reset cacheConfig', async () => {
    vi.resetModules()
    stubEnv(testConfig)

    const testModule = await import('./loadEnv')
    const first = testModule.loadEnv()

    testModule.resetCachedConfig()

    const second = testModule.loadEnv()

    expect(first === second).toBe(false)
  })

  it('throws when validation fails', async () => {
    stubEnv({
      DATABASE_URL:
        'postgre://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require'
    })
    expect(() => loadEnv()).toThrowError(/Invalid environment/i)
  })
})
