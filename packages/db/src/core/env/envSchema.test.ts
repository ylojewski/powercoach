import { ZodSafeParseResult } from 'zod'

import { NodeEnv } from '@/src/types'
import {
  developmentConfig,
  productionConfig,
  invalidConfig,
  unknownProtocolConfig
} from '@/test/fixtures'
import { expectZodParseToThrow } from '@/test/utils'

import { Env, envSchema } from './envSchema'

describe('envSchema', () => {
  it('parses valid values', () => {
    expect(() => envSchema.parse(productionConfig)).not.toThrow()
    expect(envSchema.safeParse(productionConfig)).toStrictEqual<ZodSafeParseResult<Env>>({
      data: {
        DATABASE_URL:
          'postgresql://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require',
        NODE_ENV: NodeEnv.production
      },
      success: true
    })
  })

  it('should accept localhost as DATABASE_URL', () => {
    expect(() => envSchema.parse(developmentConfig)).not.toThrow()
    expect(envSchema.safeParse(developmentConfig)).toStrictEqual<ZodSafeParseResult<Env>>({
      data: {
        DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/powercoach_dev',
        NODE_ENV: NodeEnv.development
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

    expect(zodError.issues).toStrictEqual([
      expect.objectContaining({
        message: 'Invalid URL',
        path: ['DATABASE_URL']
      }),
      expect.objectContaining({
        message: 'Invalid option: expected one of "development"|"production"|"test"',
        path: ['NODE_ENV']
      })
    ])
  })

  it('rejects unknown database URL protocol', () => {
    const zodError = expectZodParseToThrow(envSchema, unknownProtocolConfig)

    expect(zodError.issues).toStrictEqual([
      expect.objectContaining({
        message: 'Invalid URL',
        path: ['DATABASE_URL']
      })
    ])
  })
})
