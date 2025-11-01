import { HEALTH_RESPONSE_SCHEMA_ID, healthResponseSchema } from './schemas'

describe('healthResponseSchema', () => {
  it('defines the expected structure', () => {
    expect(HEALTH_RESPONSE_SCHEMA_ID).toBe('HealthResponse')
    expect(healthResponseSchema).toMatchObject({
      $id: 'HealthResponse',
      additionalProperties: false,
      type: 'object'
    })

    expect(healthResponseSchema.properties).toMatchObject({
      ok: { type: 'boolean' },
      uptime: { minimum: 0, type: 'number' }
    })
    expect(Object.keys(healthResponseSchema.properties ?? {})).toEqual(['ok', 'uptime'])
    expect(healthResponseSchema.required).toEqual(['ok', 'uptime'])
  })
})
