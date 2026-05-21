import { Type, type Static } from '@sinclair/typebox'

import { nullable, timestampSchema } from './primitives'

export const EXERCISE_SCHEMA_ID = 'Exercise' as const

export const exerciseSchema = Type.Object(
  {
    archivedAt: nullable(timestampSchema),
    bodyweightCoefficient: nullable(Type.Number()),
    code: Type.String(),
    createdAt: timestampSchema,
    descriptionMarkdown: nullable(Type.String()),
    id: Type.Number(),
    imageUrl: nullable(Type.String()),
    isSystem: Type.Boolean(),
    isUnilateral: Type.Boolean(),
    loadingTypeId: nullable(Type.Number()),
    publicationStatus: Type.String(),
    shortInstructionsMarkdown: nullable(Type.String()),
    subtitle: nullable(Type.String()),
    title: Type.String(),
    updatedAt: timestampSchema,
    videoUrl: nullable(Type.String())
  },
  {
    $id: EXERCISE_SCHEMA_ID,
    additionalProperties: false
  }
)

export type Exercise = Static<typeof exerciseSchema>
