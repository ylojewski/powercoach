import { DrawerPrimitive, Separator } from '@powercoach/ui'
import { type ReactElement, useMemo, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

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
  const [exercise, setExercise] = useState(
    initialCreation?.method === CreationMethod.Clone ? initialCreation.exercise : null
  )
  const {
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
    if (method === CreationMethod.Blank) {
      setSubmitted(true)
      dispatch(startCreation({ exercise: createBlankExercise(), method }))
      onStart()
      return
    }
    if (method === CreationMethod.Clone && exercise) {
      setSubmitted(true)
      dispatch(startCreation({ exercise, method }))
      onStart()
    }
  }

  function openResetDrawer() {
    resetDrawerHandle.open(null)
  }

  return (
    <>
      <div className="grid h-full min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-stretch overflow-hidden">
        <NewExerciseStartStepBlankCard
          actionLabel={!submitted && shouldResumeBlankCreation ? resumeActionLabel : 'Next'}
          active={method === CreationMethod.Blank}
          onActivate={() => setMethod(CreationMethod.Blank)}
          {...(shouldResetBlankCreation && { onReset: openResetDrawer })}
          onNext={() => (shouldResumeBlankCreation ? onResume() : preventNext())}
          resetLabel="Start over"
        />
        <NewExerciseStartStepCloneCard
          actionLabel={
            !submitted && shouldResumeCloneCreation(exercise) ? resumeActionLabel : 'Next'
          }
          active={method === CreationMethod.Clone}
          exercise={exercise}
          onExerciseChange={setExercise}
          onActivate={() => setMethod(CreationMethod.Clone)}
          {...(shouldResetCloneCreation(exercise) && { onReset: openResetDrawer })}
          onNext={() => (shouldResumeCloneCreation(exercise) ? onResume() : preventNext())}
          resetLabel="Start over"
        />
      </div>
      <NewExerciseStartStepResetDrawer
        confirmText={
          method === CreationMethod.Blank
            ? 'Discard and create from scratch'
            : method === CreationMethod.Clone
              ? `Discard & clone ${exercise?.title.toLowerCase()}`
              : 'Discard'
        }
        handle={resetDrawerHandle}
        onConfirm={next}
      />
    </>
  )
}
