import { DrawerPrimitive } from '@powercoach/ui'
import { type ReactElement, useMemo, useState } from 'react'

import { type Exercise, useAppDispatch, useAppSelector } from '@/core'

import { useExercises } from '../hooks'
import { CreationMethod, selectInitialCreation, startCreation } from '../store'
import { createBlankExercise } from '../utils'
import { NewExerciseStartStepBlankCard } from './NewExerciseStartStepBlankCard'
import { NewExerciseStartStepCloneCard } from './NewExerciseStartStepCloneCard'
import { NewExerciseStartStepResetDrawer } from './NewExerciseStartStepResetDrawer'

interface NewExerciseStartStepProps {
  onResume: () => void
  onStart: () => void
  resumeActionLabel: string
}

export function NewExerciseStartStep({
  onResume,
  onStart,
  resumeActionLabel
}: NewExerciseStartStepProps): ReactElement {
  const dispatch = useAppDispatch()
  const resetDrawerHandle = useMemo(() => DrawerPrimitive.createHandle(), [])
  const initialCreation = useAppSelector(selectInitialCreation)
  const [method, setMethod] = useState(initialCreation?.method ?? CreationMethod.Blank)
  const isBlank = method === CreationMethod.Blank
  const isClone = method === CreationMethod.Clone
  const [exercise, setExercise] = useState(
    initialCreation?.method === CreationMethod.Clone ? initialCreation.exercise : null
  )
  const {
    cloneExercise,
    isCurrentCreationDirty,
    shouldResetBlankCreation,
    shouldResetCloneCreation,
    shouldResumeBlankCreation,
    shouldResumeCloneCreation
  } = useExercises()
  const [submitted, setSubmitted] = useState(false)

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

    if (isBlank) {
      currentExercise = createBlankExercise()
      initialExercise = createBlankExercise()
    } else if (isClone && exercise) {
      currentExercise = cloneExercise(exercise)
      initialExercise = { ...exercise }
    } else {
      return
    }

    dispatch(startCreation({ currentExercise, initialExercise, method }))
    setSubmitted(true)
    onStart()
  }

  function openResetDrawer() {
    resetDrawerHandle.open(null)
  }

  return (
    <>
      <div className="grid h-full min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-stretch overflow-hidden">
        <NewExerciseStartStepBlankCard
          actionLabel={!submitted && shouldResumeBlankCreation ? resumeActionLabel : 'Next'}
          active={isBlank}
          onActivate={() => setMethod(CreationMethod.Blank)}
          {...(shouldResetBlankCreation && { onReset: openResetDrawer })}
          onNext={() => (shouldResumeBlankCreation ? onResume() : preventNext())}
          resetLabel="Start over"
        />
        <NewExerciseStartStepCloneCard
          actionLabel={
            !submitted && shouldResumeCloneCreation(exercise) ? resumeActionLabel : 'Next'
          }
          active={isClone}
          exercise={exercise}
          onExerciseChange={setExercise}
          onActivate={() => setMethod(CreationMethod.Clone)}
          {...(shouldResetCloneCreation(exercise) && { onReset: openResetDrawer })}
          onNext={() => (shouldResumeCloneCreation(exercise) ? onResume() : preventNext())}
          resetLabel="Start over"
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
