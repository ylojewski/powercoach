import { NodeEnv } from '@powercoach/util-env'
import { expectZodParseToThrow } from '@powercoach/util-test'
import { ZodSafeParseResult } from 'zod'

import { developmentEnv, productionEnv, invalidEnv, unknownProtocolEnv } from '@/test/fixtures'

import { Env, envSchema } from './envSchema'

describe('envSchema', () => {
  it('parses valid values', () => {
    expect(() => envSchema.parse(productionEnv)).not.toThrow()
    expect(envSchema.safeParse(productionEnv)).toStrictEqual<ZodSafeParseResult<Env>>({
      data: {
        DATABASE_URL:
          'postgresql://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require',
        NODE_ENV: NodeEnv.production
      },
      success: true
    })
  })

  it('should accept localhost as DATABASE_URL', () => {
    expect(() => envSchema.parse(developmentEnv)).not.toThrow()
    expect(envSchema.safeParse(developmentEnv)).toStrictEqual<ZodSafeParseResult<Env>>({
      data: {
        DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/powercoach_dev',
        NODE_ENV: NodeEnv.development
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
      })
    ])
  })

  it('rejects unknown database URL protocol', () => {
    const zodError = expectZodParseToThrow(envSchema, unknownProtocolEnv)

    expect(zodError.issues).toStrictEqual([
      expect.objectContaining({
        message: 'Invalid URL',
        path: ['DATABASE_URL']
      })
    ])
  })
})
