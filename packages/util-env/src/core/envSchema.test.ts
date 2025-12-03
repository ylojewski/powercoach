import { expectZodParseToThrow } from '@powercoach/util-test'
import { ZodSafeParseResult } from 'zod'

import { NodeEnv } from '@/src/types'
import { testConfig, productionConfig, invalidConfig, developmentConfig } from '@/test/fixtures'

import { type Env, envSchema } from './envSchema'

describe('envSchema', () => {
  it('parses valid values', () => {
    expect(() => envSchema.parse(productionConfig)).not.toThrow()
    expect(envSchema.safeParse(productionConfig)).toStrictEqual<ZodSafeParseResult<Env>>({
      data: { NODE_ENV: NodeEnv.production },
      success: true
    })
    expect(() => envSchema.parse(testConfig)).not.toThrow()
    expect(envSchema.safeParse(testConfig)).toStrictEqual<ZodSafeParseResult<Env>>({
      data: { NODE_ENV: NodeEnv.test },
      success: true
    })
    expect(() => envSchema.parse(developmentConfig)).not.toThrow()
    expect(envSchema.safeParse(developmentConfig)).toStrictEqual<ZodSafeParseResult<Env>>({
      data: { NODE_ENV: NodeEnv.development },
      success: true
    })
  })

  it('rejects empty values', () => {
    const validEnvKeys = new RegExp(Object.keys(productionConfig).join('|'))
    expect(() => envSchema.parse({})).toThrow(validEnvKeys)
  })

  it('rejects invalid values', () => {
    const zodError = expectZodParseToThrow(envSchema, invalidConfig)
    expect(zodError.issues).toStrictEqual([
      expect.objectContaining({
        message: 'Invalid option: expected one of "development"|"production"|"test"',
        path: ['NODE_ENV']
      })
    ])
  })
})
