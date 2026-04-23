import { stubEnv } from '@powercoach/util-test'

import { type Env } from '@/src/core'
import { productionEnv, tooBigPortEnv } from '@/test/fixtures'

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
    stubEnv({ ...productionEnv, PORT: productionEnv.PORT.toString() })
    expect(loadEnv()).toStrictEqual<Env>(productionEnv)
  })

  it('throws when validation fails', async () => {
    stubEnv({ PORT: tooBigPortEnv.PORT.toString() })
    expect(() => loadEnv()).toThrowError(/Invalid environment/i)
  })
})
