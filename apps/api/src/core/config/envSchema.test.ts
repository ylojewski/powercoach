import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { envSchema } from './envSchema'

describe('envSchema', () => {
  it('parses minimal configuration using defaults', () => {
    const config = envSchema.parse({})

    expect(config).toEqual({
      HOST: '0.0.0.0',
      LOG_LEVEL: 'info',
      NODE_ENV: 'development',
      PORT: 3000
    })
  })

  it('accepts known host values including IPv6', () => {
    expect(envSchema.parse({ HOST: '0.0.0.0' }).HOST).toBe('0.0.0.0')
    expect(envSchema.parse({ HOST: 'localhost' }).HOST).toBe('localhost')
    expect(envSchema.parse({ HOST: '::' }).HOST).toBe('::')
  })

  describe('PORT boundaries', () => {
    it('rejects negative ports', () => {
      const result = envSchema.safeParse({ PORT: -1 })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]).toMatchObject({ code: 'too_small', path: ['PORT'] })
      }
    })

    it('rejects ports above 65535', () => {
      const result = envSchema.safeParse({ PORT: 65536 })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]).toMatchObject({ code: 'too_big', path: ['PORT'] })
      }
    })

    it('rejects non-integer ports', () => {
      const result = envSchema.safeParse({ PORT: 3.14 })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]).toMatchObject({ code: 'invalid_type', path: ['PORT'] })
      }
    })

    it('rejects non-numeric ports', () => {
      const result = envSchema.safeParse({ PORT: 'abc' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]).toMatchObject({ code: 'invalid_type', path: ['PORT'] })
      }
    })
  })

  describe('enum validations', () => {
    it('rejects unsupported LOG_LEVEL values', () => {
      const result = envSchema.safeParse({ LOG_LEVEL: 'verbose' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]).toMatchObject({ code: 'invalid_value', path: ['LOG_LEVEL'] })
      }
    })

    it('rejects unsupported NODE_ENV values', () => {
      const result = envSchema.safeParse({ NODE_ENV: 'staging' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]).toMatchObject({ code: 'invalid_value', path: ['NODE_ENV'] })
      }
    })
  })

  it('rejects additional properties thanks to strict mode', () => {
    const result = envSchema.safeParse({ EXTRA: 'nope' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({ code: 'unrecognized_keys', path: [] })
    }
  })

  it('validates port coercion using property-based testing', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: -10, max: 70000 }), async (port) => {
        const result = envSchema.safeParse({ PORT: port })
        const isValid = Number.isInteger(port) && port >= 0 && port <= 65535
        expect(result.success).toBe(isValid)
      })
    )
  })
})
