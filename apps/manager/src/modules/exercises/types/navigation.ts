export interface ExercisesNavigation {
  exerciseIndex: () => string
  newExercise: () => string
}

declare module '@/core' {
  interface Navigation extends ExercisesNavigation {}
}

export {}
