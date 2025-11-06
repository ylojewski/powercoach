import { Options } from '@fastify/ajv-compiler'
import { ajvOptions } from '@src/app/ajvOptions'
import { type AppConfig, resetCachedConfig } from '@src/core'
import { HEALTH_MODULE_NAME } from '@src/modules'
import { HELMET_PLUGIN_NAME, SENSIBLE_PLUGIN_NAME } from '@src/plugins'
import { invalidConfig, testConfig } from '@test/fixtures/env'
import { getAjvOptions } from '@test/utils/app'
import { stubEnv } from '@test/utils/env'
import { AppFastifyInstance, buildApp } from './buildApp'

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

  describe('instance', () => {
    let app: AppFastifyInstance

    beforeEach(async () => {
      app = await buildApp({ config: testConfig })
    })

    afterEach(async () => {
      await app.close()
    })

    it('uses strict ajv options', async () => {
      expect(getAjvOptions(app)).toStrictEqual<Options>(ajvOptions)
    })

    it('registers required plugins and modules', async () => {
      expect(app.hasPlugin(HELMET_PLUGIN_NAME)).toBe(true)
      expect(app.hasPlugin(SENSIBLE_PLUGIN_NAME)).toBe(true)
      expect(app.hasPlugin(HEALTH_MODULE_NAME)).toBe(true)
    })
  })
})
