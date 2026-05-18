import { DrawerPrimitive, Separator } from '@powercoach/ui'
import { type ReactElement, useMemo, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { useExercises } from '../hooks'
import {
  CreationMethod,
  selectInitialCreation,
  setCreationStep,
  startCreation,
  Step
} from '../store'
import { createBlankExercise } from '../utils'
import { NewExerciseSourcePanelBlankCard } from './NewExerciseSourcePanelBlankCard'
import { NewExerciseSourcePanelCloneCard } from './NewExerciseSourcePanelCloneCard'
import { NewExerciseSourcePanelResetDrawer } from './NewExerciseSourcePanelResetDrawer'

export function NewExerciseSourcePanel(): ReactElement {
  const dispatch = useAppDispatch()
  const resetDrawerHandle = useMemo(() => DrawerPrimitive.createHandle(), [])
  const initialCreation = useAppSelector(selectInitialCreation)
  const [method, setMethod] = useState(initialCreation?.method ?? null)
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
    }
    if (method === CreationMethod.Clone && exercise) {
      setSubmitted(true)
      dispatch(startCreation({ exercise, method }))
    }
  }

  function resume() {
    dispatch(setCreationStep(Step.Overview))
  }

  function openResetDrawer() {
    resetDrawerHandle.open(null)
  }

  return (
    <>
      <div className="grid h-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch overflow-hidden">
        <NewExerciseSourcePanelBlankCard
          actionLabel={!submitted && shouldResumeBlankCreation ? 'Resume' : 'Next'}
          active={method === CreationMethod.Blank}
          onActivate={() => setMethod(CreationMethod.Blank)}
          {...(shouldResetBlankCreation && { onReset: openResetDrawer })}
          onNext={() => (shouldResumeBlankCreation ? resume() : preventNext())}
          resetLabel="Start over"
        />
        <Separator orientation="vertical" />
        <NewExerciseSourcePanelCloneCard
          actionLabel={!submitted && shouldResumeCloneCreation(exercise) ? 'Resume' : 'Next'}
          active={method === CreationMethod.Clone}
          exercise={exercise}
          onExerciseChange={setExercise}
          onActivate={() => setMethod(CreationMethod.Clone)}
          {...(shouldResetCloneCreation(exercise) && { onReset: openResetDrawer })}
          onNext={() => (shouldResumeCloneCreation(exercise) ? resume() : preventNext())}
          resetLabel="Start over"
        />
      </div>
      <NewExerciseSourcePanelResetDrawer
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
