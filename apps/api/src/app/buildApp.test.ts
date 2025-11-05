import { type AppConfig, resetCachedConfig } from '@src/core'
import { invalidConfig, testConfig } from '@test/fixtures/env'
import { stubEnv } from '@test/utils/env'
import { buildApp } from './buildApp'

describe('buildApp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    resetCachedConfig()
  })

  describe('when using the passed configuration', () => {
    it('succeed if valid', async () => {
      const app = await buildApp({ config: testConfig })

      expect(app.hasDecorator('config')).toBe(true)
      expect(app.config).toStrictEqual<AppConfig>(testConfig)

      await app.close()
    })

    it('fails if invalid', async () => {
      await expect(buildApp({ config: invalidConfig })).rejects.toThrow(/^Invalid configuration/i)
    })
  })

  describe('when using the environment configuration', () => {
    it('succeed if valid', async () => {
      stubEnv(testConfig)

      const app = await buildApp()

      expect(app.hasDecorator('config')).toBe(true)
      expect(app.config).toStrictEqual<AppConfig>(testConfig)

      await app.close()
    })

    it('fails if invalid', async () => {
      stubEnv(invalidConfig)
      await expect(buildApp()).rejects.toThrow(/^Invalid environment configuration/i)
    })
  })
})
