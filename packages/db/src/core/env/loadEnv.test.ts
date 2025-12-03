import { NodeEnv } from '@powercoach/util-env'
import { stubEnv } from '@powercoach/util-test'
import { config } from 'dotenv'

import { Env } from '@/src/core'

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

  it('throws when validation fails', async () => {
    stubEnv({
      DATABASE_URL:
        'postgre://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require'
    })
    expect(() => loadEnv()).toThrowError(/Invalid environment/i)
  })
})
