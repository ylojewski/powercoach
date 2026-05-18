import {
  HorizontalPanel,
  HorizontalPanelContent,
  HorizontalPanelItem,
  HorizontalPanelTrigger
} from '@powercoach/ui'
import { type ReactElement, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { Step, selectCreationResumeStep, setCreationResumeStep } from '../store'
import { NewExerciseActions } from './NewExerciseActions'
import { NewExerciseCategorizationPanel } from './NewExerciseCategorizationPanel'
import { NewExerciseInstructionsPanel } from './NewExerciseInstructionsPanel'
import { NewExerciseMusclesPanel } from './NewExerciseMusclesPanel'
import { NewExerciseOverviewPanel } from './NewExerciseOverviewPanel'
import { NewExerciseReviewPanel } from './NewExerciseReviewPanel'
import { NewExerciseSourcePanel } from './NewExerciseSourcePanel'
import { NewExerciseTrackingPanel } from './NewExerciseTrackingPanel'

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
      <div className="relative min-h-0 flex-1 border-y border-r">
        <HorizontalPanel<Step>
          collapsible={false}
          onValueChange={onHorizontalPanelValueChange}
          value={[step]}
        >
          <HorizontalPanelItem value={Step.Start}>
            <HorizontalPanelTrigger>start</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseSourcePanel
                onResume={resume}
                onStart={start}
                resumeActionLabel={resumeActionLabel}
              />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Overview}>
            <HorizontalPanelTrigger>overview</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseOverviewPanel />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Categorization}>
            <HorizontalPanelTrigger>categorization</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseCategorizationPanel />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Tracking}>
            <HorizontalPanelTrigger>tracking</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseTrackingPanel />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Muscles}>
            <HorizontalPanelTrigger>muscles</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseMusclesPanel />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Instructions}>
            <HorizontalPanelTrigger>instructions</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseInstructionsPanel />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Review}>
            <HorizontalPanelTrigger>review</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseReviewPanel />
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
