import { Type, type Static } from '@sinclair/typebox'

export const HEALTH_RESPONSE_SCHEMA_ID = 'HealthResponse' as const

export const healthResponseSchema = Type.Object(
  {
    database: Type.Boolean(),
    live: Type.Boolean(),
    ready: Type.Boolean(),
    uptime: Type.Number({ minimum: 0 })
  },
  {
    $id: HEALTH_RESPONSE_SCHEMA_ID,
    additionalProperties: false
  }
)

export type HealthResponse = Static<typeof healthResponseSchema>
