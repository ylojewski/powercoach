import Ajv from 'ajv'
import { describe, expect, it, expectTypeOf } from 'vitest'
import { HEALTH_RESPONSE_SCHEMA_ID, healthResponseSchema, type HealthResponse } from './schemas'

describe('health schemas', () => {
  it('exposes the expected schema identifier', () => {
    expect(HEALTH_RESPONSE_SCHEMA_ID).toBe('HealthResponse')
    expect(healthResponseSchema.$id).toBe(HEALTH_RESPONSE_SCHEMA_ID)
  })

  it('can be registered within Ajv and retrieved by id', () => {
    const ajv = new Ajv({ removeAdditional: 'all' })

    ajv.addSchema(healthResponseSchema)
    const validator = ajv.getSchema(HEALTH_RESPONSE_SCHEMA_ID)

    expect(validator).toBeTypeOf('function')
    expect(validator?.({ ok: true, uptime: 1 })).toBe(true)
  })

  it('validates objects strictly', () => {
    const ajv = new Ajv({ removeAdditional: 'all' })
    ajv.addSchema(healthResponseSchema)
    const validate = ajv.getSchema(HEALTH_RESPONSE_SCHEMA_ID)
    if (!validate) {
      throw new Error('validator should exist')
    }

    expect(validate({ ok: true, uptime: 0 })).toBe(true)
    expect(validate({ ok: true, uptime: -1 })).toBe(false)
    expect(validate({ ok: true })).toBe(false)
    const payload = { ok: true, uptime: 1, extra: true }
    expect(validate(payload)).toBe(true)
    expect(payload).toEqual({ ok: true, uptime: 1 })
  })

  it('allows schema registration multiple times', () => {
    const ajv = new Ajv({ removeAdditional: 'all' })
    ajv.addSchema(healthResponseSchema)

    expect(() => ajv.addSchema(healthResponseSchema)).toThrow(/already exists/)

    const validator = ajv.getSchema(HEALTH_RESPONSE_SCHEMA_ID)
    expect(validator).toBeTypeOf('function')
    expect(validator?.({ ok: true, uptime: 1 })).toBe(true)
  })

  it('matches the expected HealthResponse type shape', () => {
    const value: HealthResponse = { ok: true, uptime: 1 }
    expect(value).toEqual({ ok: true, uptime: 1 })
    expectTypeOf(value).toMatchTypeOf<HealthResponse>()
  })
})
