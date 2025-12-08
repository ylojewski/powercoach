import { stubEnv } from '@powercoach/util-test'
import { config } from 'dotenv'
import { type MockedFunction } from 'vitest'
import { z } from 'zod'

import { type Env } from '@/src/core'
import { NodeEnv } from '@/src/types'
import { invalidEnv, productionEnv, testEnv } from '@/test/fixtures'

import { createEnvLoader } from './createEnvLoader'
import { envSchema } from './envSchema'

vi.mock('dotenv', () => ({
  config: vi.fn()
}))

const configMock = config as MockedFunction<typeof config>

function mockConfigImplementationOnce<T extends Env>(env: T) {
  configMock.mockImplementationOnce(() => {
    stubEnv(env)
    return { parsed: env }
  })
}

describe('createEnvLoader', () => {
  describe('with a base schema', () => {
    const { loadEnv, resetCachedEnv } = createEnvLoader({
      format: () => 'Invalid environment',
      schema: envSchema
    })

    beforeEach(async () => {
      resetCachedEnv()
      vi.clearAllMocks()
      vi.unstubAllEnvs()
    })

    it('loads configuration from process.env', async () => {
      mockConfigImplementationOnce(productionEnv)
      expect(loadEnv()).toStrictEqual<Env>(productionEnv)
      expect(config).toHaveBeenCalledTimes(1)
    })

    it('uses cached configuration on subsequent calls', async () => {
      mockConfigImplementationOnce(productionEnv)

      const first = loadEnv()
      const second = loadEnv()

      expect(first).toBe(second)
      expect(second).toStrictEqual<Env>(productionEnv)
      expect(config).toHaveBeenCalledTimes(1)
    })

    it('should not reset cached env', async () => {
      vi.resetModules()
      vi.stubEnv('NODE_ENV', NodeEnv.production) // Overrides vitest NODE_ENV

      mockConfigImplementationOnce(productionEnv)

      const productionModule = await import('./createEnvLoader')
      const productionEnvLoader = productionModule.createEnvLoader({
        format: () => '',
        schema: envSchema
      })

      const first = productionEnvLoader.loadEnv()
      productionEnvLoader.resetCachedEnv()
      const second = productionEnvLoader.loadEnv()

      expect(first === second).toBe(true)
    })

    it('should reset cached env in dev-like environments', async () => {
      vi.resetModules()
      mockConfigImplementationOnce(testEnv)

      const testModule = await import('./createEnvLoader')
      const testEnvLoader = testModule.createEnvLoader({ format: () => '', schema: envSchema })

      const first = testEnvLoader.loadEnv()
      testEnvLoader.resetCachedEnv()
      const second = testEnvLoader.loadEnv()

      expect(first === second).toBe(false)
    })

    it('throws when validation fails', async () => {
      mockConfigImplementationOnce(invalidEnv)
      expect(() => loadEnv()).toThrowError(/Invalid environment/i)
    })
  })

  describe('with a custom schema', () => {
    const customSchema = envSchema.extend({ CUSTOM: z.literal('custom') })
    type CustomEnv = z.infer<typeof customSchema>
    const customProductionEnv: CustomEnv = { ...productionEnv, CUSTOM: 'custom' }
    const customTestEnv: CustomEnv = { ...testEnv, CUSTOM: 'custom' }
    const customInvalidEnv: CustomEnv = { ...invalidEnv, CUSTOM: 'invalid' as 'custom' }

    const { loadEnv: customLoadEnv, resetCachedEnv: customResetCachedEnv } = createEnvLoader({
      format: () => 'Invalid custom environment',
      schema: customSchema
    })

    beforeEach(async () => {
      customResetCachedEnv()
      vi.clearAllMocks()
      vi.unstubAllEnvs()
    })

    it('loads custom configuration from process.env', async () => {
      mockConfigImplementationOnce(customProductionEnv)
      expect(customLoadEnv()).toStrictEqual<CustomEnv>(customProductionEnv)
      expect(config).toHaveBeenCalledTimes(1)
    })

    it('uses cached custom configuration on subsequent calls', async () => {
      mockConfigImplementationOnce(customProductionEnv)

      const first = customLoadEnv()
      const second = customLoadEnv()

      expect(first).toBe(second)
      expect(second).toStrictEqual<CustomEnv>(customProductionEnv)
      expect(config).toHaveBeenCalledTimes(1)
    })

    it('should not reset custom cached env', async () => {
      vi.resetModules()
      vi.stubEnv('NODE_ENV', NodeEnv.production) // Overrides vitest NODE_ENV

      mockConfigImplementationOnce(customProductionEnv)

      const customProductionModule = await import('./createEnvLoader')
      const customProductionEnvLoader = customProductionModule.createEnvLoader({
        format: () => '',
        schema: customSchema
      })

      const first = customProductionEnvLoader.loadEnv()
      customProductionEnvLoader.resetCachedEnv()
      const second = customProductionEnvLoader.loadEnv()

      expect(first === second).toBe(true)
    })

    it('should reset custom cached env in dev-like environments', async () => {
      vi.resetModules()
      mockConfigImplementationOnce(customTestEnv)

      const customTestModule = await import('./createEnvLoader')
      const customTestEnvLoader = customTestModule.createEnvLoader({
        format: () => '',
        schema: customSchema
      })

      const first = customTestEnvLoader.loadEnv()
      customTestEnvLoader.resetCachedEnv()
      const second = customTestEnvLoader.loadEnv()

      expect(first === second).toBe(false)
    })

    it('throws when custom validation fails', async () => {
      mockConfigImplementationOnce(customInvalidEnv)
      expect(() => customLoadEnv()).toThrowError(/Invalid custom environment/i)
    })
  })
})
