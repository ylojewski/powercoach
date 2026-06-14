import { DrawerPrimitive } from '@powercoach/ui'
import { type ReactElement, useMemo, useState } from 'react'

import { type Exercise, useAppDispatch } from '@/core'
import { useReferences } from '@/modules/references'

import { useExerciseCreation, useExercises } from '../hooks'
import { CreationMethod, type CreationExerciseRelationship, startCreation } from '../store'
import { createBlankExercise } from '../utils'
import { NewExerciseStartStepBlankCard } from './NewExerciseStartStepBlankCard'
import { NewExerciseStartStepCloneCard } from './NewExerciseStartStepCloneCard'
import { NewExerciseStartStepResetDrawer } from './NewExerciseStartStepResetDrawer'

interface NewExerciseStartStepProps {
  onStart: () => void
}

export function NewExerciseStartStep({ onStart }: NewExerciseStartStepProps): ReactElement {
  const dispatch = useAppDispatch()
  const { references } = useReferences()
  const resetDrawerHandle = useMemo(() => DrawerPrimitive.createHandle(), [])
  const {
    initialCreation,
    isCurrentCreationDirty,
    canStartCreation,
    shouldResetBlankCreation,
    shouldResetCloneCreation
  } = useExerciseCreation()
  const [method, setMethod] = useState(initialCreation?.method)
  const isBlank = method === CreationMethod.Blank
  const isClone = method === CreationMethod.Clone
  const [exercise, setExercise] = useState(
    initialCreation?.method === CreationMethod.Clone ? initialCreation.exercise : null
  )
  const canStartBlankCreation = canStartCreation(CreationMethod.Blank, null)
  const canStartCloneCreation = canStartCreation(CreationMethod.Clone, exercise)
  const { cloneExercise } = useExercises()

  function preventNext(): void {
    if (isCurrentCreationDirty) {
      openResetDrawer()
      return
    }
    next()
  }

  function next() {
    let currentExercise: Exercise
    let initialExercise: Exercise
    let currentExerciseRelationships: CreationExerciseRelationship[]
    let initialExerciseRelationships: CreationExerciseRelationship[]

    if (isBlank) {
      currentExercise = createBlankExercise()
      initialExercise = createBlankExercise()
      currentExerciseRelationships = []
      initialExerciseRelationships = []
    } else if (isClone && exercise) {
      currentExercise = cloneExercise(exercise)
      initialExercise = { ...exercise }
      currentExerciseRelationships = getCloneExerciseRelationships(exercise)
      initialExerciseRelationships = getCloneExerciseRelationships(exercise)
    } else {
      return
    }

    dispatch(
      startCreation({
        currentExercise,
        currentExerciseRelationships,
        initialExercise,
        initialExerciseRelationships,
        method
      })
    )
    onStart()
  }

  function isCurrentSourceSelected(): boolean {
    if (isBlank) {
      return initialCreation?.method === CreationMethod.Blank
    }

    if (isClone && exercise) {
      return (
        initialCreation?.method === CreationMethod.Clone &&
        initialCreation.exercise.code === exercise.code
      )
    }

    return false
  }

  function handleNext(): void {
    if (isCurrentSourceSelected()) {
      onStart()
      return
    }

    preventNext()
  }

  function getCloneExerciseRelationships(exercise: Exercise): CreationExerciseRelationship[] {
    if (!references) {
      return []
    }

    return references.exerciseRelationships.flatMap((relationship) => {
      if (relationship.sourceExerciseId !== exercise.id) {
        return []
      }

      const discipline = references.disciplines.find(({ id }) => id === relationship.disciplineId)

      if (!discipline) {
        return []
      }

      return {
        defaultTransferCoefficient: relationship.defaultTransferCoefficient,
        disciplineCode: discipline.code,
        roleId: relationship.roleId,
        targetDisciplineMovementId: relationship.targetDisciplineMovementId
      }
    })
  }

  function openResetDrawer() {
    resetDrawerHandle.open(null)
  }

  return (
    <>
      <div className="grid h-full min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-stretch overflow-hidden">
        <NewExerciseStartStepBlankCard
          active={isBlank}
          canNext={canStartBlankCreation}
          onActivate={() => setMethod(CreationMethod.Blank)}
          {...(shouldResetBlankCreation && { onReset: openResetDrawer })}
          onNext={handleNext}
        />
        <NewExerciseStartStepCloneCard
          active={isClone}
          canNext={canStartCloneCreation}
          exercise={exercise}
          onExerciseChange={setExercise}
          onActivate={() => setMethod(CreationMethod.Clone)}
          {...(shouldResetCloneCreation(exercise) && { onReset: openResetDrawer })}
          onNext={handleNext}
        />
      </div>
      <NewExerciseStartStepResetDrawer
        confirmText={(() => {
          if (isBlank) return 'Create from scratch anyway'
          if (isClone) return `Clone ${exercise?.title.toLowerCase()} anyway`
          return 'Discard'
        })()}
        handle={resetDrawerHandle}
        onConfirm={next}
      />
    </>
  )
}
