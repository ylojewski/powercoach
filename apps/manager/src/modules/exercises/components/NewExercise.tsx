import {
  cn,
  HorizontalPanel,
  HorizontalPanelContent,
  HorizontalPanelItem,
  HorizontalPanelTrigger
} from '@powercoach/ui'
import { type ReactElement, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { Step, selectCreationResumeStep, setCreationResumeStep } from '../store'
import { NewExerciseActions } from './NewExerciseActions'
import { NewExerciseCategorizationStep } from './NewExerciseCategorizationStep'
import { NewExerciseInstructionsStep } from './NewExerciseInstructionsStep'
import { NewExerciseMusclesStep } from './NewExerciseMusclesStep'
import { NewExerciseOverviewStep } from './NewExerciseOverviewStep'
import { NewExerciseReviewStep } from './NewExerciseReviewStep'
import { NewExerciseStartStep } from './NewExerciseStartStep'
import { NewExerciseTrackingStep } from './NewExerciseTrackingStep'

export function NewExercise(): ReactElement {
  const dispatch = useAppDispatch()
  const resumeStep = useAppSelector(selectCreationResumeStep)
  const [step, setStep] = useState(Step.Start)
  const resumeActionLabel = `Resume at ${resumeStep ?? Step.Overview}`

  const onHorizontalPanelValueChange = ([newStep = Step.Start]: Step[]) => {
    setStep(newStep)

    if (newStep !== Step.Start) {
      dispatch(setCreationResumeStep(newStep))
    }
  }

  const resume = () => {
    setStep(resumeStep ?? Step.Overview)
  }

  const start = () => {
    setStep(Step.Overview)
  }

  return (
    <div className="flex flex-1 flex-col" data-testid="new-exercise">
      <div className={cn('relative min-h-0 flex-1 border-y', step === Step.Review && 'border-r')}>
        <HorizontalPanel<Step>
          collapsible={false}
          onValueChange={onHorizontalPanelValueChange}
          value={[step]}
        >
          <HorizontalPanelItem value={Step.Start}>
            <HorizontalPanelTrigger>start</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseStartStep
                onResume={resume}
                onStart={start}
                resumeActionLabel={resumeActionLabel}
              />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Overview}>
            <HorizontalPanelTrigger>overview</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseOverviewStep />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Categorization}>
            <HorizontalPanelTrigger>categorization</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseCategorizationStep />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Tracking}>
            <HorizontalPanelTrigger>tracking</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseTrackingStep />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Muscles}>
            <HorizontalPanelTrigger>muscles</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseMusclesStep />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Instructions}>
            <HorizontalPanelTrigger>instructions</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseInstructionsStep />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Review}>
            <HorizontalPanelTrigger>review</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseReviewStep />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
        </HorizontalPanel>
      </div>
      <div>
        <NewExerciseActions />
      </div>
    </div>
  )
}
