import referencesData from '@/test/fixtures/references.json'
import {
  type Exercise,
  type Muscle,
  type ReferencesResponse
} from '@/test/fixtures/references.types'

export const exerciseReferences = referencesData as ReferencesResponse

export function findReferenceExercise(code: string): Exercise | undefined {
  return exerciseReferences.exercises.find((exercise) => exercise.code === code)
}

export function findReferenceMuscle(code: string): Muscle | undefined {
  return exerciseReferences.muscles.find((muscle) => muscle.code === code)
}

export function getCompetitionExercises(): Exercise[] {
  return exerciseReferences.exercises.filter((exercise) =>
    exercise.relationships.some(
      (relationship) =>
        relationship.role.code === 'competition' &&
        relationship.targetExercise.code === exercise.code
    )
  )
}

export function getMuscleParentName(muscle: Muscle): string {
  const parentMuscle = muscle.parentMuscleId
    ? exerciseReferences.muscles.find((candidate) => candidate.id === muscle.parentMuscleId)
    : null

  return parentMuscle?.commonName ?? 'Top level'
}
