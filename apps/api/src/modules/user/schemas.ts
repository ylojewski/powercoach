import { Type, type Static } from '@sinclair/typebox'

export const USER_RESPONSE_SCHEMA_ID = 'UserResponse' as const

export const userResponseSchema = Type.Object(
  {
    email: Type.String({ format: 'email' }),
    id: Type.String({ format: 'uuid' })
  },
  {
    $id: USER_RESPONSE_SCHEMA_ID,
    additionalProperties: false
  }
)

export type UserResponse = Static<typeof userResponseSchema>
