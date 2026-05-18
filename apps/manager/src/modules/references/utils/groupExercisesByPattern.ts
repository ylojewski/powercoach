import { type Exercise, type GetReferencesApiResponse, type Pattern } from '@/core'

export type ExercisePatternCommon = Pick<Exercise, keyof Exercise & keyof Pattern>
export type ExercisePatternSortKey = keyof ExercisePatternCommon

export interface ExerciseGroupByPattern extends Pattern {
  exercises: Exercise[]
}

export interface ExerciseGroupItemByPattern {
  code: string
  items: Exercise[]
  value: string
}

export interface GroupExercisesByPatternOptions {
  sortKey?: ExercisePatternSortKey
}

export function groupExercisesByPattern(
  references: GetReferencesApiResponse,
  options?: GroupExercisesByPatternOptions
): ExerciseGroupByPattern[] {
  if (!references) {
    return []
  }

  const sortKey = options?.sortKey ?? 'code'
  const compareCode = (a: ExercisePatternCommon, b: ExercisePatternCommon): number => {
    return a[sortKey] > b[sortKey] ? 1 : -1
  }

  const patterns = sortKey ? [...references.patterns].sort(compareCode) : references.patterns
  const exercises = sortKey ? [...references.exercises].sort(compareCode) : references.exercises

  return patterns.map((pattern) => {
    return {
      ...pattern,
      exercises: exercises.filter(
        (exercise) =>
          references.exercisePatterns.find(
            ({ exerciseId, isPrimary, patternId }) =>
              patternId === pattern.id && exerciseId === exercise.id && isPrimary
          ) !== undefined
      )
    }
  }, [])
}

export function groupExercisesByPatternItem(
  references: GetReferencesApiResponse,
  options?: GroupExercisesByPatternOptions
): ExerciseGroupItemByPattern[] {
  return groupExercisesByPattern(references, options).map(
    ({ code, exercises: items, name: value }) => ({ code, items, value })
  )
}
