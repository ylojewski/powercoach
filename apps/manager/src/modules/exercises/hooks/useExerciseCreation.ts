import { useCallback, useMemo } from 'react'

import {
  type Discipline,
  type DisciplineMovement,
  type Exercise,
  type ExerciseRole,
  type LoadingType,
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
  Step,
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
  bodyweightPercentage: number
  canGoToNextStep: (step: Step) => boolean
  canStartCreation: (method: CreationMethod, exercise: Exercise | null) => boolean
  completedRelationships: CreationExerciseRelationship[]
  createdRelationships: CreationExerciseRelationship[]
  currentCreation: Creation | null
  getRelationshipStatus: (disciplineCode: Discipline['code']) => RelationshipStatus
  initialCreation: Creation | null
  isCurrentCreationDirty: boolean
  selectedPattern: Pattern | null
  selectedLoadingType: LoadingType | null
  shouldResetBlankCreation: boolean
  shouldResetCloneCreation: (exercise: Exercise | null) => boolean
  shouldShowBodyweightCoefficient: boolean
  updateBodyweightCoefficient: (coefficient: NonNullable<Exercise['bodyweightCoefficient']>) => void
  updateExercise: (exercise: Partial<Exercise>) => void
  updateIsUnilateral: (isUnilateral: Exercise['isUnilateral']) => void
  updateLoadingType: (loadingType: LoadingType | null) => void
  updatePattern: (pattern: Pattern | null) => void
  upsertRelationship: (relationship: CreationExerciseRelationship) => void
}

const BODYWEIGHT_LOADING_TYPE_CODES = new Set([
  'assisted_bodyweight',
  'bodyweight',
  'bodyweight_plus_external'
])
const DEFAULT_BODYWEIGHT_COEFFICIENT = 1

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
  const selectedLoadingType =
    references?.loadingTypes.find(
      (loadingType) => loadingType.id === currentCreation?.exercise.loadingTypeId
    ) ?? null
  const shouldShowBodyweightCoefficient = isBodyweightLoadingType(selectedLoadingType)
  const bodyweightPercentage = Math.round(
    (currentCreation?.exercise.bodyweightCoefficient ?? DEFAULT_BODYWEIGHT_COEFFICIENT) * 100
  )
  const isOverviewComplete = Boolean(
    currentCreation?.exercise.title.trim() && currentCreation.exercise.code.trim()
  )
  const isCategorizationComplete = Boolean(
    currentCreation?.exercise.patternId != null && completedRelationships.length
  )

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

  const canStartCreation = useCallback(
    (method: CreationMethod, exercise: Exercise | null): boolean => {
      if (method === CreationMethod.Blank) {
        return true
      }

      return Boolean(exercise)
    },
    []
  )

  const canGoToNextStep = useCallback(
    (step: Step): boolean => {
      if (!currentCreation) {
        return false
      }

      switch (step) {
        case Step.Start:
          return true
        case Step.Overview:
          return isOverviewComplete
        case Step.Categorization:
          return isCategorizationComplete
        case Step.Tracking:
        case Step.Muscles:
        case Step.Instructions:
          return true
        case Step.Review:
          return false
      }
    },
    [currentCreation, isCategorizationComplete, isOverviewComplete]
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

  const updateLoadingType = useCallback(
    (loadingType: LoadingType | null) => {
      if (!loadingType) {
        dispatch(updateCreationExercise({ bodyweightCoefficient: null, loadingTypeId: null }))
        return
      }

      dispatch(
        updateCreationExercise({
          bodyweightCoefficient: isBodyweightLoadingType(loadingType)
            ? (currentCreation?.exercise.bodyweightCoefficient ?? DEFAULT_BODYWEIGHT_COEFFICIENT)
            : null,
          loadingTypeId: loadingType.id
        })
      )
    },
    [currentCreation?.exercise.bodyweightCoefficient, dispatch]
  )

  const updateBodyweightCoefficient = useCallback(
    (bodyweightCoefficient: NonNullable<Exercise['bodyweightCoefficient']>) => {
      dispatch(updateCreationExercise({ bodyweightCoefficient }))
    },
    [dispatch]
  )

  const updateIsUnilateral = useCallback(
    (isUnilateral: Exercise['isUnilateral']) => {
      dispatch(updateCreationExercise({ isUnilateral }))
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
    bodyweightPercentage,
    canGoToNextStep,
    canStartCreation,
    completedRelationships,
    createdRelationships,
    currentCreation,
    getRelationshipStatus,
    initialCreation,
    isCurrentCreationDirty,
    selectedLoadingType,
    selectedPattern,
    shouldResetBlankCreation,
    shouldResetCloneCreation,
    shouldShowBodyweightCoefficient,
    updateBodyweightCoefficient,
    updateExercise,
    updateIsUnilateral,
    updateLoadingType,
    updatePattern,
    upsertRelationship
  }
}

function isBodyweightLoadingType(loadingType: LoadingType | null): boolean {
  return Boolean(loadingType && BODYWEIGHT_LOADING_TYPE_CODES.has(loadingType.code))
}

function isCreationExerciseRelationshipComplete(
  relationship: CreationExerciseRelationship
): boolean {
  return relationship.roleId !== undefined && relationship.targetDisciplineMovementId !== undefined
}
