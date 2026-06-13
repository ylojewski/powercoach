import { useCallback } from 'react'

import { type Exercise } from '@/core'

interface UseExercisesResult {
  cloneExercise: (exercise: Exercise) => Exercise
}

export function useExercises(): UseExercisesResult {
  const cloneExercise = useCallback((exercise: Exercise) => {
    return { ...exercise, title: `${exercise.title} copy` }
  }, [])

  return {
    cloneExercise
  }
}
