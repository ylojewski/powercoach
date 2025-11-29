import { beforeEach, describe, expect, it, vi } from 'vitest'

import { type DbConfig } from './envSchema'
import { loadDbConfig, resetCachedDbConfig } from './loadConfig'
import * as parse from './parseConfig'

vi.mock('dotenv', () => ({
  config: vi.fn()
}))

describe('loadDbConfig', () => {
  const validConfig: DbConfig = {
    DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/powercoach'
  }

  beforeEach(() => {
    vi.stubEnv('DATABASE_URL', validConfig.DATABASE_URL)
    resetCachedDbConfig()
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.stubEnv('DATABASE_URL', validConfig.DATABASE_URL)
  })

  it('parses the environment once and caches the result', () => {
    const parseSpy = vi.spyOn(parse, 'parseDbConfig')

    const firstLoad = loadDbConfig()
    const secondLoad = loadDbConfig()

    expect(firstLoad).toStrictEqual(validConfig)
    expect(secondLoad).toBe(firstLoad)
    expect(parseSpy).toHaveBeenCalledOnce()
  })

  it('resets the cached configuration', () => {
    const firstLoad = loadDbConfig()

    vi.stubEnv('DATABASE_URL', 'postgres://postgres:postgres@localhost:5432/alternate')
    resetCachedDbConfig()

    const secondLoad = loadDbConfig()

    expect(firstLoad).not.toBe(secondLoad)
    expect(secondLoad.DATABASE_URL).toBe('postgres://postgres:postgres@localhost:5432/alternate')
  })

  it('throws when parsing fails', () => {
    vi.unstubAllEnvs()
    vi.stubEnv('DATABASE_URL', '')

    expect(() => loadDbConfig()).toThrow(/Invalid database configuration: /)
  })
})
