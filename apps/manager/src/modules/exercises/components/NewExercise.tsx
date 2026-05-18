import {
  HorizontalPanel,
  HorizontalPanelContent,
  HorizontalPanelItem,
  HorizontalPanelTrigger
} from '@powercoach/ui'
import { type ReactElement } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { Step, setCreationStep, selectCreationStep } from '../store'
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
  const step = useAppSelector(selectCreationStep)

  const onHorizontalPanelValueChange = ([newStep = Step.Start]: Step[]) => {
    dispatch(setCreationStep(newStep))
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
              <NewExerciseSourcePanel />
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
