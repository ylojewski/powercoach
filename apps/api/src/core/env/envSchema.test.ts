import { NodeEnv } from '@powercoach/util-env'
import { expectZodParseToThrow } from '@powercoach/util-test'
import { ZodSafeParseResult } from 'zod'

import { LogLevel } from '@/src/types'
import { developmentEnv, productionEnv, invalidEnv, tooBigPortEnv } from '@/test/fixtures'

import { Env, envSchema } from './envSchema'

describe('envSchema', () => {
  it('parses valid values', () => {
    expect(() => envSchema.parse(productionEnv)).not.toThrow()
    expect(envSchema.safeParse(productionEnv)).toStrictEqual<ZodSafeParseResult<Env>>({
      data: {
        DATABASE_URL: 'postgresql://user:password@region.neon.tech/neondb?sslmode=require',
        HOST: '0.0.0.0',
        LOG_LEVEL: LogLevel.info,
        NODE_ENV: NodeEnv.production,
        PORT: 8080
      },
      success: true
    })
  })

  it('should accept localhost as HOST', () => {
    expect(() => envSchema.parse(developmentEnv)).not.toThrow()
    expect(envSchema.safeParse(developmentEnv)).toStrictEqual<ZodSafeParseResult<Env>>({
      data: {
        DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/powercoach_dev',
        HOST: 'localhost',
        LOG_LEVEL: LogLevel.debug,
        NODE_ENV: NodeEnv.development,
        PORT: 8080
      },
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
      }),
      expect.objectContaining({
        message: 'Invalid URL',
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
        message: 'Too small: expected number to be >=1',
        path: ['PORT']
      })
    ])
  })

  it('rejects a too big PORT value', () => {
    const zodError = expectZodParseToThrow(envSchema, tooBigPortEnv)

    expect(zodError.issues).toStrictEqual([
      expect.objectContaining({
        message: 'Too big: expected number to be <=65535',
        path: ['PORT']
      })
    ])
  })
})
