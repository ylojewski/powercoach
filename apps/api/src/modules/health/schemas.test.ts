import { HEALTH_RESPONSE_SCHEMA_ID, healthResponseSchema } from './schemas'

describe('healthResponseSchema', () => {
  it('defines the expected structure', () => {
    expect(HEALTH_RESPONSE_SCHEMA_ID).toBe('HealthResponse')
    expect(healthResponseSchema).toMatchObject({
      $id: 'HealthResponse',
      additionalProperties: false,
      type: 'object'
    })
  })
})
