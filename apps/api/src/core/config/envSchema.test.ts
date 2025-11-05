import { productionConfig, invalidConfig, tooBigPortConfig } from '@test/fixtures/env'
import { expectZodParseToThrow } from '@test/utils/zod'
import { ZodSafeParseResult } from 'zod'
import { AppConfig, envSchema } from './envSchema'
import { LOG_LEVEL, NODE_ENV } from '@/types/env.d'

describe('envSchema', () => {
  it('parses valid values', () => {
    expect(() => envSchema.parse(productionConfig)).not.toThrow()
    expect(envSchema.safeParse(productionConfig)).toStrictEqual<ZodSafeParseResult<AppConfig>>({
      data: {
        HOST: '127.0.0.1',
        LOG_LEVEL: LOG_LEVEL.error,
        NODE_ENV: NODE_ENV.production,
        PORT: 4002
      },
      success: true
    })
  })

  it('rejects empty values', () => {
    const validEnvKeys = new RegExp(Object.keys(productionConfig).join('|'))
    expect(() => envSchema.parse({})).toThrow(validEnvKeys)
  })

  it('rejects full invalid values', () => {
    const zodError = expectZodParseToThrow(envSchema, invalidConfig)

    expect(zodError.issues).toStrictEqual([
      expect.objectContaining({
        message: 'Invalid IPv4 address',
        path: ['HOST']
      }),
      expect.objectContaining({
        message:
          'Invalid option: expected one of "debug"|"error"|"fatal"|"info"|"silent"|"trace"|"warn"',
        path: ['LOG_LEVEL']
      }),
      expect.objectContaining({
        message: 'Invalid option: expected one of "development"|"production"|"test"',
        path: ['NODE_ENV']
      }),
      expect.objectContaining({
        message: 'Too small: expected number to be >=1',
        path: ['PORT']
      })
    ])
  })

  it('rejects a too big PORT value', () => {
    const zodError = expectZodParseToThrow(envSchema, tooBigPortConfig)

    expect(zodError.issues).toStrictEqual([
      expect.objectContaining({
        message: 'Too big: expected number to be <=65535',
        path: ['PORT']
      })
    ])
  })
})
