import { Type, type Static } from '@sinclair/typebox'

import { exerciseSchema, nullable } from '@/src/schemas'

export const EXERCISE_CODE_RESPONSE_SCHEMA_ID = 'ExerciseCodeResponse' as const

export const exerciseCodeQuerystringSchema = Type.Object(
  {
    title: Type.String({ minLength: 1 })
  },
  {
    additionalProperties: false
  }
)

export const exerciseCodeResponseSchema = Type.Object(
  {
    code: Type.String(),
    exercise: nullable(Type.Ref(exerciseSchema))
  },
  {
    $id: EXERCISE_CODE_RESPONSE_SCHEMA_ID,
    additionalProperties: false
  }
)

export const exerciseSchemas = [exerciseCodeResponseSchema] as const

export type ExerciseCodeQuerystring = Static<typeof exerciseCodeQuerystringSchema>
export type ExerciseCodeResponse = Static<typeof exerciseCodeResponseSchema>
