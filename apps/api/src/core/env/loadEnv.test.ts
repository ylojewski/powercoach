import { NodeEnv } from '@powercoach/util-env'
import { stubEnv } from '@powercoach/util-test'
import { config } from 'dotenv'

import { Env } from '@/src/core'
import { LogLevel } from '@/src/types'

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
      HOST: '0.0.0.0',
      LOG_LEVEL: LogLevel.info,
      NODE_ENV: NodeEnv.production,
      PORT: '8080'
    })

    expect(loadEnv()).toStrictEqual<Env>({
      HOST: '0.0.0.0',
      LOG_LEVEL: LogLevel.info,
      NODE_ENV: NodeEnv.production,
      PORT: 8080
    })
    expect(config).toHaveBeenCalledTimes(1)
  })

  it('throws when validation fails', async () => {
    stubEnv({ PORT: '70000' })
    expect(() => loadEnv()).toThrowError(/Invalid environment/i)
  })
})
