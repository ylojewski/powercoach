import { expectZodParseToThrow } from '@powercoach/util-test'
import { ZodSafeParseResult } from 'zod'

import { NodeEnv } from '@/src/types'
import { testEnv, productionEnv, invalidEnv, developmentEnv } from '@/test/fixtures'

import { type Env, envSchema } from './envSchema'

describe('envSchema', () => {
  it('parses valid values', () => {
    expect(() => envSchema.parse(productionEnv)).not.toThrow()
    expect(envSchema.safeParse(productionEnv)).toStrictEqual<ZodSafeParseResult<Env>>({
      data: { NODE_ENV: NodeEnv.production },
      success: true
    })
    expect(() => envSchema.parse(testEnv)).not.toThrow()
    expect(envSchema.safeParse(testEnv)).toStrictEqual<ZodSafeParseResult<Env>>({
      data: { NODE_ENV: NodeEnv.test },
      success: true
    })
    expect(() => envSchema.parse(developmentEnv)).not.toThrow()
    expect(envSchema.safeParse(developmentEnv)).toStrictEqual<ZodSafeParseResult<Env>>({
      data: { NODE_ENV: NodeEnv.development },
      success: true
    })
  })

  it('rejects empty values', () => {
    const validEnvKeys = new RegExp(Object.keys(productionEnv).join('|'))
    expect(() => envSchema.parse({})).toThrow(validEnvKeys)
  })

  it('rejects invalid values', () => {
    const zodError = expectZodParseToThrow(envSchema, invalidEnv)
    expect(zodError.issues).toStrictEqual([
      expect.objectContaining({
        message: 'Invalid option: expected one of "development"|"production"|"test"',
        path: ['NODE_ENV']
      })
    ])
  })
})
