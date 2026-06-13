import { useCallback, useMemo } from 'react'

import {
  type Discipline,
  type DisciplineMovement,
  type Exercise,
  type ExerciseRole,
  type Pattern,
  useAppDispatch,
  useAppSelector
} from '@/core'
import { useReferences } from '@/modules/references'

import {
  CreationMethod,
  type Creation,
  type CreationExerciseRelationship,
  selectCurrentCreation,
  selectInitialCreation,
  updateCreationExercise,
  upsertCreationExerciseRelationship
} from '../store'

interface RelationshipStatus {
  completed: boolean
  movement: DisciplineMovement | null
  relationship: CreationExerciseRelationship | null
  role: ExerciseRole | null
  transferPercentage: number
}

interface UseExerciseCreationResult {
  activeDisciplineCode: Discipline['code'] | null
  completedRelationships: CreationExerciseRelationship[]
  createdRelationships: CreationExerciseRelationship[]
  currentCreation: Creation | null
  getRelationshipStatus: (disciplineCode: Discipline['code']) => RelationshipStatus
  initialCreation: Creation | null
  isCurrentCreationDirty: boolean
  selectedPattern: Pattern | null
  shouldResetBlankCreation: boolean
  shouldResetCloneCreation: (exercise: Exercise | null) => boolean
  shouldResumeBlankCreation: boolean
  shouldResumeCloneCreation: (exercise: Exercise | null) => boolean
  updateExercise: (exercise: Partial<Exercise>) => void
  updatePattern: (pattern: Pattern | null) => void
  upsertRelationship: (relationship: CreationExerciseRelationship) => void
}

export function useExerciseCreation(): UseExerciseCreationResult {
  const dispatch = useAppDispatch()
  const currentCreation = useAppSelector(selectCurrentCreation)
  const initialCreation = useAppSelector(selectInitialCreation)
  const { references } = useReferences()
  const createdRelationships = useMemo(
    () => currentCreation?.exerciseRelationships ?? [],
    [currentCreation]
  )
  const completedRelationships = useMemo(
    () => createdRelationships.filter(isCreationExerciseRelationshipComplete),
    [createdRelationships]
  )
  const activeDisciplineCode =
    completedRelationships[0]?.disciplineCode ?? createdRelationships[0]?.disciplineCode ?? null
  const relationshipByDisciplineCode = useMemo(() => {
    return new Map(
      createdRelationships.map((relationship) => [relationship.disciplineCode, relationship])
    )
  }, [createdRelationships])
  const movementById = useMemo(() => {
    return new Map(references?.disciplineMovements.map((movement) => [movement.id, movement]) ?? [])
  }, [references?.disciplineMovements])
  const roleById = useMemo(() => {
    return new Map(references?.exerciseRoles.map((role) => [role.id, role]) ?? [])
  }, [references?.exerciseRoles])
  const selectedPattern =
    references?.patterns.find((pattern) => pattern.id === currentCreation?.exercise.patternId) ??
    null

  const isCurrentCreationDirty = useMemo((): boolean => {
    return (
      Boolean(initialCreation) &&
      Boolean(currentCreation) &&
      JSON.stringify({
        exercise: initialCreation?.exercise,
        exerciseRelationships: initialCreation?.exerciseRelationships
      }) !==
        JSON.stringify({
          exercise: currentCreation?.exercise,
          exerciseRelationships: currentCreation?.exerciseRelationships
        })
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

  const getRelationshipStatus = useCallback(
    (disciplineCode: Discipline['code']): RelationshipStatus => {
      const relationship = relationshipByDisciplineCode.get(disciplineCode) ?? null

      return {
        completed: Boolean(relationship && completedRelationships.includes(relationship)),
        movement: relationship?.targetDisciplineMovementId
          ? (movementById.get(relationship.targetDisciplineMovementId) ?? null)
          : null,
        relationship,
        role: relationship?.roleId ? (roleById.get(relationship.roleId) ?? null) : null,
        transferPercentage: Math.round((relationship?.defaultTransferCoefficient ?? 0) * 100)
      }
    },
    [completedRelationships, movementById, relationshipByDisciplineCode, roleById]
  )

  const updateExercise = useCallback(
    (exercise: Partial<Exercise>) => {
      dispatch(updateCreationExercise(exercise))
    },
    [dispatch]
  )

  const updatePattern = useCallback(
    (pattern: Pattern | null) => {
      dispatch(updateCreationExercise({ patternId: pattern?.id ?? null }))
    },
    [dispatch]
  )

  const upsertRelationship = useCallback(
    (relationship: CreationExerciseRelationship) => {
      dispatch(upsertCreationExerciseRelationship(relationship))
    },
    [dispatch]
  )

  return {
    activeDisciplineCode,
    completedRelationships,
    createdRelationships,
    currentCreation,
    getRelationshipStatus,
    initialCreation,
    isCurrentCreationDirty,
    selectedPattern,
    shouldResetBlankCreation,
    shouldResetCloneCreation,
    shouldResumeBlankCreation,
    shouldResumeCloneCreation,
    updateExercise,
    updatePattern,
    upsertRelationship
  }
}

function isCreationExerciseRelationshipComplete(
  relationship: CreationExerciseRelationship
): boolean {
  return (
    relationship.defaultTransferCoefficient !== undefined &&
    relationship.defaultTransferCoefficient > 0 &&
    relationship.roleId !== undefined &&
    relationship.targetDisciplineMovementId !== undefined
  )
}
