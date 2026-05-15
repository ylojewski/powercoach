import { type ExercisesNavigation } from '../types'

export enum ExercisesNavigationPath {
  Index = '',
  New = 'new'
}

export const exercisesNavigation = {
  exerciseIndex: () => ExercisesNavigationPath.Index,
  newExercise: () => ExercisesNavigationPath.New
} as const satisfies ExercisesNavigation
