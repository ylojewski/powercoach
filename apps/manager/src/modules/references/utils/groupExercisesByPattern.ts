import { type Exercise, type GetReferencesApiResponse, type Pattern } from '@/core'

export type PatternGroupCommon = Pick<Exercise, keyof Exercise & keyof Pattern>
export type PatternGroupSortKey = keyof PatternGroupCommon

export interface ExerciseGroupByPattern extends Pattern {
  exercises: Exercise[]
}

export interface ExerciseGroupItemByPattern {
  code: string
  items: Exercise[]
  value: string
}

export interface GroupExercisesByPatternOptions {
  sortKey?: PatternGroupSortKey
}

export function groupExercisesByPattern(
  references: GetReferencesApiResponse,
  options?: GroupExercisesByPatternOptions
): ExerciseGroupByPattern[] {
  if (!references) {
    return []
  }

  const sortKey = options?.sortKey ?? 'code'
  const compareCode = (a: PatternGroupCommon, b: PatternGroupCommon): number => {
    return a[sortKey] > b[sortKey] ? 1 : -1
  }

  const patterns = sortKey ? [...references.patterns].sort(compareCode) : references.patterns
  const exercises = sortKey ? [...references.exercises].sort(compareCode) : references.exercises

  return patterns.map((pattern) => {
    return {
      ...pattern,
      exercises: exercises.filter((exercise) => exercise.patternId === pattern.id)
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
