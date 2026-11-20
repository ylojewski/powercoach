import { Type, type Static } from '@sinclair/typebox'

import { exerciseSchema, nullable, timestampSchema } from '@/src/schemas'

export const DISCIPLINE_SCHEMA_ID = 'Discipline' as const
export const DISCIPLINE_MOVEMENT_SCHEMA_ID = 'DisciplineMovement' as const
export const EXERCISE_MUSCLE_SCHEMA_ID = 'ExerciseMuscle' as const
export const EXERCISE_RELATIONSHIP_SCHEMA_ID = 'ExerciseRelationship' as const
export const EXERCISE_ROLE_SCHEMA_ID = 'ExerciseRole' as const
export const LOADING_TYPE_SCHEMA_ID = 'LoadingType' as const
export const MUSCLE_ROLE_SCHEMA_ID = 'MuscleRole' as const
export const MUSCLE_SCHEMA_ID = 'Muscle' as const
export const PATTERN_SCHEMA_ID = 'Pattern' as const
export const REFERENCES_RESPONSE_SCHEMA_ID = 'ReferencesResponse' as const

const referenceEntityProperties = {
  code: Type.String(),
  createdAt: timestampSchema,
  description: Type.String(),
  id: Type.Number(),
  name: Type.String(),
  updatedAt: timestampSchema
} as const

export const disciplineSchema = Type.Object(referenceEntityProperties, {
  $id: DISCIPLINE_SCHEMA_ID,
  additionalProperties: false
})

export const disciplineMovementSchema = Type.Object(
  {
    code: Type.String(),
    description: Type.String(),
    disciplineId: Type.Number(),
    id: Type.Number(),
    name: Type.String(),
    sortOrder: Type.Number()
  },
  {
    $id: DISCIPLINE_MOVEMENT_SCHEMA_ID,
    additionalProperties: false
  }
)

export const exerciseMuscleSchema = Type.Object(
  {
    exerciseId: Type.Number(),
    muscleId: Type.Number(),
    muscleRoleId: Type.Number(),
    weightPercentage: Type.Number()
  },
  {
    $id: EXERCISE_MUSCLE_SCHEMA_ID,
    additionalProperties: false
  }
)

export const exerciseRelationshipSchema = Type.Object(
  {
    createdAt: timestampSchema,
    defaultTransferCoefficient: Type.Number(),
    disciplineId: Type.Number(),
    id: Type.Number(),
    roleId: Type.Number(),
    sourceExerciseId: Type.Number(),
    targetDisciplineMovementId: Type.Number(),
    updatedAt: timestampSchema
  },
  {
    $id: EXERCISE_RELATIONSHIP_SCHEMA_ID,
    additionalProperties: false
  }
)

export const exerciseRoleSchema = Type.Object(referenceEntityProperties, {
  $id: EXERCISE_ROLE_SCHEMA_ID,
  additionalProperties: false
})

export const loadingTypeSchema = Type.Object(referenceEntityProperties, {
  $id: LOADING_TYPE_SCHEMA_ID,
  additionalProperties: false
})

export const muscleRoleSchema = Type.Object(referenceEntityProperties, {
  $id: MUSCLE_ROLE_SCHEMA_ID,
  additionalProperties: false
})

export const muscleSchema = Type.Object(
  {
    chain: nullable(Type.String()),
    code: Type.String(),
    commonName: nullable(Type.String()),
    createdAt: timestampSchema,
    description: Type.String(),
    id: Type.Number(),
    name: Type.String(),
    parentMuscleId: nullable(Type.Number()),
    updatedAt: timestampSchema
  },
  {
    $id: MUSCLE_SCHEMA_ID,
    additionalProperties: false
  }
)

export const patternSchema = Type.Object(referenceEntityProperties, {
  $id: PATTERN_SCHEMA_ID,
  additionalProperties: false
})

export const referencesResponseSchema = Type.Object(
  {
    disciplineMovements: Type.Array(Type.Ref(disciplineMovementSchema)),
    disciplines: Type.Array(Type.Ref(disciplineSchema)),
    exerciseMuscles: Type.Array(Type.Ref(exerciseMuscleSchema)),
    exerciseRelationships: Type.Array(Type.Ref(exerciseRelationshipSchema)),
    exerciseRoles: Type.Array(Type.Ref(exerciseRoleSchema)),
    exercises: Type.Array(Type.Ref(exerciseSchema)),
    loadingTypes: Type.Array(Type.Ref(loadingTypeSchema)),
    muscleRoles: Type.Array(Type.Ref(muscleRoleSchema)),
    muscles: Type.Array(Type.Ref(muscleSchema)),
    patterns: Type.Array(Type.Ref(patternSchema))
  },
  {
    $id: REFERENCES_RESPONSE_SCHEMA_ID,
    additionalProperties: false
  }
)

export const referenceSchemas = [
  disciplineSchema,
  disciplineMovementSchema,
  exerciseMuscleSchema,
  exerciseRelationshipSchema,
  exerciseRoleSchema,
  loadingTypeSchema,
  muscleRoleSchema,
  muscleSchema,
  patternSchema,
  referencesResponseSchema
] as const

export type Discipline = Static<typeof disciplineSchema>
export type DisciplineMovement = Static<typeof disciplineMovementSchema>
export type ExerciseMuscle = Static<typeof exerciseMuscleSchema>
export type ExerciseRelationship = Static<typeof exerciseRelationshipSchema>
export type ExerciseRole = Static<typeof exerciseRoleSchema>
export type LoadingType = Static<typeof loadingTypeSchema>
export type MuscleRole = Static<typeof muscleRoleSchema>
export type Muscle = Static<typeof muscleSchema>
export type Pattern = Static<typeof patternSchema>
export type ReferencesResponse = Static<typeof referencesResponseSchema>
