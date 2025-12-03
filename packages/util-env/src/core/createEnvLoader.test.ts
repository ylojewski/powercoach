import { stubEnv } from '@powercoach/util-test'
import { config } from 'dotenv'
import { z } from 'zod'

import { type Env } from '@/src/core'
import { NodeEnv } from '@/src/types'
import { productionConfig, testConfig } from '@/test/fixtures'

import { createEnvLoader } from './createEnvLoader'
import { envSchema } from './envSchema'

vi.mock('dotenv', () => ({
  config: vi.fn()
}))

describe('createEnvLoader', () => {
  describe('with a base schema', () => {
    const { loadEnv, resetCachedConfig } = createEnvLoader({
      format: () => 'Invalid environment',
      schema: envSchema
    })
    beforeEach(async () => {
      resetCachedConfig()
      vi.clearAllMocks()
      vi.unstubAllEnvs()
    })

    it('loads configuration from process.env', async () => {
      stubEnv({ NODE_ENV: NodeEnv.production })
      expect(loadEnv()).toStrictEqual<Env>({ NODE_ENV: NodeEnv.production })
      expect(config).toHaveBeenCalledTimes(1)
    })

    it('uses cached configuration on subsequent calls', async () => {
      stubEnv({ NODE_ENV: NodeEnv.production })

      const first = loadEnv()
      const second = loadEnv()

      expect(first).toBe(second)
      expect(second).toStrictEqual<Env>({ NODE_ENV: NodeEnv.production })
      expect(config).toHaveBeenCalledTimes(1)
    })

    it('should not reset cacheConfig', async () => {
      vi.resetModules()
      stubEnv(productionConfig)

      const productionModule = await import('./createEnvLoader')
      const productionEnvLoader = productionModule.createEnvLoader({
        format: () => '',
        schema: envSchema
      })

      const first = productionEnvLoader.loadEnv()
      productionEnvLoader.resetCachedConfig()
      const second = productionEnvLoader.loadEnv()

      expect(first === second).toBe(true)
    })

    it('should reset cacheConfig', async () => {
      vi.resetModules()
      stubEnv(testConfig)

      const testModule = await import('./createEnvLoader')
      const testEnvLoader = testModule.createEnvLoader({ format: () => '', schema: envSchema })

      const first = testEnvLoader.loadEnv()
      testEnvLoader.resetCachedConfig()
      const second = testEnvLoader.loadEnv()

      expect(first === second).toBe(false)
    })

    it('throws when validation fails', async () => {
      stubEnv({ NODE_ENV: 'invalid' as NodeEnv })
      expect(() => loadEnv()).toThrowError(/Invalid environment/i)
    })
  })

  describe('with a custom schema', () => {
    const customSchema = envSchema.extend({ CUSTOM: z.string() })
    const customProductionConfig = { ...productionConfig, CUSTOM: 'custom' }
    const customTestConfig = { ...testConfig, CUSTOM: 'custom' }
    type CustomEnv = z.infer<typeof customSchema>

    const { loadEnv: customLoadEnv, resetCachedConfig: customResetCachedConfig } = createEnvLoader({
      format: () => 'Invalid custom environment',
      schema: customSchema
    })

    beforeEach(async () => {
      customResetCachedConfig()
      vi.clearAllMocks()
      vi.unstubAllEnvs()
    })

    it('loads custom configuration from process.env', async () => {
      stubEnv({ CUSTOM: 'custom', NODE_ENV: NodeEnv.production })
      expect(customLoadEnv()).toStrictEqual<CustomEnv>({
        CUSTOM: 'custom',
        NODE_ENV: NodeEnv.production
      })
      expect(config).toHaveBeenCalledTimes(1)
    })

    it('uses cached custom configuration on subsequent calls', async () => {
      stubEnv({ CUSTOM: 'custom', NODE_ENV: NodeEnv.production })

      const first = customLoadEnv()
      const second = customLoadEnv()

      expect(first).toBe(second)
      expect(second).toStrictEqual<CustomEnv>({ CUSTOM: 'custom', NODE_ENV: NodeEnv.production })
      expect(config).toHaveBeenCalledTimes(1)
    })

    it('should not reset custom cacheConfig', async () => {
      vi.resetModules()
      stubEnv(customProductionConfig)

      const customProductionModule = await import('./createEnvLoader')
      const customProductionEnvLoader = customProductionModule.createEnvLoader({
        format: () => '',
        schema: customSchema
      })

      const first = customProductionEnvLoader.loadEnv()
      customProductionEnvLoader.resetCachedConfig()
      const second = customProductionEnvLoader.loadEnv()

      expect(first === second).toBe(true)
    })

    it('should reset custom cacheConfig', async () => {
      vi.resetModules()
      stubEnv(customTestConfig)

      const customTestModule = await import('./createEnvLoader')
      const customTestEnvLoader = customTestModule.createEnvLoader({
        format: () => '',
        schema: customSchema
      })

      const first = customTestEnvLoader.loadEnv()
      customTestEnvLoader.resetCachedConfig()
      const second = customTestEnvLoader.loadEnv()

      expect(first === second).toBe(false)
    })

    it('throws when custom validation fails', async () => {
      stubEnv({ CUSTOM: '42', NODE_ENV: 'invalid' as NodeEnv })
      expect(() => customLoadEnv()).toThrowError(/Invalid custom environment/i)
    })
  })
})
