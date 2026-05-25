import { useCallback, useMemo } from 'react'

import { type Exercise, useAppSelector } from '@/core'

import { CreationMethod, selectCurrentCreation, selectInitialCreation } from '../store'

interface UseExercisesResult {
  cloneExercise: (exercise: Exercise) => Exercise
  isCurrentCreationDirty: boolean
  shouldResetBlankCreation: boolean
  shouldResetCloneCreation: (exercise: Exercise | null) => boolean
  shouldResumeBlankCreation: boolean
  shouldResumeCloneCreation: (exercise: Exercise | null) => boolean
}

export function useExercises(): UseExercisesResult {
  const currentCreation = useAppSelector(selectCurrentCreation)
  const initialCreation = useAppSelector(selectInitialCreation)

  const isCurrentCreationDirty = useMemo((): boolean => {
    return (
      Boolean(initialCreation) &&
      Boolean(currentCreation) &&
      JSON.stringify(initialCreation?.exercise) !== JSON.stringify(currentCreation?.exercise)
    )
  }, [currentCreation, initialCreation])

  const shouldResetBlankCreation =
    initialCreation?.method === CreationMethod.Blank && isCurrentCreationDirty

  const shouldResetCloneCreation = useCallback(
    (exercise: Exercise | null) => {
      if (!initialCreation || !exercise) {
        return false
      }
      return (
        initialCreation.method === CreationMethod.Clone &&
        initialCreation.exercise.code === exercise.code &&
        isCurrentCreationDirty
      )
    },
    [initialCreation, isCurrentCreationDirty]
  )

  const shouldResumeBlankCreation = initialCreation?.method === CreationMethod.Blank

  const shouldResumeCloneCreation = useCallback(
    (exercise: Exercise | null) => {
      if (!initialCreation || !exercise) {
        return false
      }
      return (
        initialCreation.method === CreationMethod.Clone &&
        initialCreation.exercise.code === exercise.code
      )
    },
    [initialCreation]
  )

  const cloneExercise = useCallback((exercise: Exercise) => {
    return { ...exercise, title: `${exercise.title} copy` }
  }, [])

  return {
    cloneExercise,
    isCurrentCreationDirty,
    shouldResetBlankCreation,
    shouldResetCloneCreation,
    shouldResumeBlankCreation,
    shouldResumeCloneCreation
  }
}
