import { NodeEnv } from '@powercoach/util-env'
import { stubEnv } from '@powercoach/util-test'

import { type Env } from '@/src/core'
import { LogLevel } from '@/src/types'

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
    stubEnv({
      DATABASE_URL: 'postgresql://user:password@region.neon.tech/neondb?sslmode=require',
      HOST: '0.0.0.0',
      LOG_LEVEL: LogLevel.info,
      NODE_ENV: NodeEnv.production,
      PORT: '8080'
    })
    expect(loadEnv()).toStrictEqual<Env>({
      DATABASE_URL: 'postgresql://user:password@region.neon.tech/neondb?sslmode=require',
      HOST: '0.0.0.0',
      LOG_LEVEL: LogLevel.info,
      NODE_ENV: NodeEnv.production,
      PORT: 8080
    })
  })

  it('throws when validation fails', async () => {
    stubEnv({ PORT: '70000' })
    expect(() => loadEnv()).toThrowError(/Invalid environment/i)
  })
})
