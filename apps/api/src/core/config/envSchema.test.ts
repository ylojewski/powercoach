import { ZodSafeParseResult } from 'zod'

import { LogLevel, NodeEnv } from '@/src/types'
import {
  devolopmentConfig,
  productionConfig,
  invalidConfig,
  tooBigPortConfig
} from '@/test/fixtures'
import { expectZodParseToThrow } from '@/test/utils'

import { AppConfig, envSchema } from './envSchema'

describe('envSchema', () => {
  it('parses valid values', () => {
    expect(() => envSchema.parse(productionConfig)).not.toThrow()
    expect(envSchema.safeParse(productionConfig)).toStrictEqual<ZodSafeParseResult<AppConfig>>({
      data: {
        DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/powercoach',
        HOST: '0.0.0.0',
        LOG_LEVEL: LogLevel.info,
        NODE_ENV: NodeEnv.production,
        PORT: 8080
      },
      success: true
    })
  })

  it('should accept localhost as HOST', () => {
    expect(() => envSchema.parse(devolopmentConfig)).not.toThrow()
    expect(envSchema.safeParse(devolopmentConfig)).toStrictEqual<ZodSafeParseResult<AppConfig>>({
      data: {
        DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/powercoach',
        HOST: 'localhost',
        LOG_LEVEL: LogLevel.debug,
        NODE_ENV: NodeEnv.development,
        PORT: 8080
      },
      success: true
    })
  })

  it('rejects empty values', () => {
    const validEnvKeys = new RegExp(Object.keys(productionConfig).join('|'))
    expect(() => envSchema.parse({})).toThrow(validEnvKeys)
  })

  it('rejects invalid values', () => {
    const zodError = expectZodParseToThrow(envSchema, invalidConfig)

    expect(zodError.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['DATABASE_URL']
        }),
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
    )
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
