import { Type, type Static } from '@sinclair/typebox'

export const SETTINGS_RESPONSE_SCHEMA_ID = 'SettingsResponse' as const

export const settingsResponseSchema = Type.Object(
  {
    defaultOrganizationId: Type.Number()
  },
  {
    $id: SETTINGS_RESPONSE_SCHEMA_ID,
    additionalProperties: false
  }
)

export type SettingsResponse = Static<typeof settingsResponseSchema>
