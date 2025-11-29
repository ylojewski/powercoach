import { describe, expect, it } from 'vitest'

import { dbEnvSchema, type DbConfig } from './envSchema'

const validConfig: DbConfig = {
  DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/powercoach'
}

describe('dbEnvSchema', () => {
  it('accepts a valid configuration', () => {
    const parsedConfig = dbEnvSchema.parse(validConfig)

    expect(parsedConfig).toStrictEqual(validConfig)
  })

  it('rejects invalid configuration', () => {
    expect(() => dbEnvSchema.parse({})).toThrow(/DATABASE_URL/)
    expect(() => dbEnvSchema.parse({ DATABASE_URL: 'not-a-url' })).toThrow(/DATABASE_URL/)
  })
})
