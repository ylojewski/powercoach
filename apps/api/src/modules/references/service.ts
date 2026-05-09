import { type RouteHandlerMethod } from 'fastify'

import { findReferences, type ReferenceRows } from '@/src/repositories'

import {
  type Exercise,
  type ExerciseRelationship,
  type Muscle,
  type ReferencesResponse
} from './schemas'

interface TimestampedReference {
  createdAt: Date
  updatedAt: Date
}

function serializeTimestampedReference<T extends TimestampedReference>(
  reference: T
): Omit<T, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string } {
  return {
    ...reference,
    createdAt: reference.createdAt.toISOString(),
    updatedAt: reference.updatedAt.toISOString()
  }
}

function serializeNullableTimestamp(timestamp: Date | null): string | null {
  return timestamp?.toISOString() ?? null
}

function serializeExercise(exercise: ReferenceRows['exercises'][number]): Exercise {
  return {
    ...serializeTimestampedReference(exercise),
    archivedAt: serializeNullableTimestamp(exercise.archivedAt)
  }
}

function serializeExerciseRelationship(
  relationship: ReferenceRows['exerciseRelationships'][number]
): ExerciseRelationship {
  return serializeTimestampedReference(relationship)
}

function serializeMuscle(muscle: ReferenceRows['muscles'][number]): Muscle {
  return serializeTimestampedReference(muscle)
}

export const getReferences: RouteHandlerMethod = async (request): Promise<ReferencesResponse> => {
  const references = await findReferences(request.server.db)

  return {
    disciplines: references.disciplines.map(serializeTimestampedReference),
    exerciseMuscles: references.exerciseMuscles,
    exercisePatterns: references.exercisePatterns,
    exerciseRelationships: references.exerciseRelationships.map(serializeExerciseRelationship),
    exerciseRoles: references.exerciseRoles.map(serializeTimestampedReference),
    exercises: references.exercises.map(serializeExercise),
    loadingTypes: references.loadingTypes.map(serializeTimestampedReference),
    muscleRoles: references.muscleRoles.map(serializeTimestampedReference),
    muscles: references.muscles.map(serializeMuscle),
    patterns: references.patterns.map(serializeTimestampedReference)
  }
}
