import { stubEnv } from '@powercoach/util-test'
import { config } from 'dotenv'

import { Env } from '@/src/core'
import { productionEnv, unknownProtocolEnv } from '@/test/fixtures'

import { loadEnv, resetCachedEnv } from './loadEnv'

vi.mock('dotenv', () => ({
  config: vi.fn()
}))

describe('loadEnv', () => {
  beforeEach(async () => {
    resetCachedEnv()
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  it('loads configuration from process.env', async () => {
    stubEnv(productionEnv)

    expect(loadEnv()).toStrictEqual<Env>(productionEnv)
    expect(config).toHaveBeenCalledTimes(1)
  })

  it('throws when validation fails', async () => {
    stubEnv({ DATABASE_URL: unknownProtocolEnv.DATABASE_URL })
    expect(() => loadEnv()).toThrowError(/Invalid environment/i)
  })
})
