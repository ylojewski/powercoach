import { describe, expect, it } from 'vitest'
import {
  HEALTH_RESPONSE_SCHEMA_ID,
  healthResponseSchema
} from '../../../src/modules/health/schemas'

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
