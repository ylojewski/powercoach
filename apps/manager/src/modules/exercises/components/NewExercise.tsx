import {
  HorizontalPanel,
  HorizontalPanelContent,
  HorizontalPanelItem,
  HorizontalPanelTrigger
} from '@powercoach/ui'
import { type ReactElement } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import { selectCreatingPanel, setCreatingPanel } from '../store'
import { ExercisePanel } from '../types'
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
  const panel = useAppSelector(selectCreatingPanel) ?? ExercisePanel.Source

  const handleOnPanelValueChange = ([newPanel = ExercisePanel.Source]: ExercisePanel[]) => {
    dispatch(setCreatingPanel(newPanel))
  }

  return (
    <div className="flex flex-1 flex-col" data-testid="new-exercise">
      <div className="relative min-h-0 flex-1 border-y border-r">
        <HorizontalPanel<ExercisePanel>
          collapsible={false}
          onValueChange={handleOnPanelValueChange}
          value={[panel]}
        >
          <HorizontalPanelItem value={ExercisePanel.Source}>
            <HorizontalPanelTrigger>source</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseSourcePanel />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={ExercisePanel.Overview}>
            <HorizontalPanelTrigger>overview</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseOverviewPanel />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={ExercisePanel.Categorization}>
            <HorizontalPanelTrigger>categorization</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseCategorizationPanel />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={ExercisePanel.Tracking}>
            <HorizontalPanelTrigger>tracking</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseTrackingPanel />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={ExercisePanel.Muscles}>
            <HorizontalPanelTrigger>muscles</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseMusclesPanel />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={ExercisePanel.Instructions}>
            <HorizontalPanelTrigger>instructions</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseInstructionsPanel />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={ExercisePanel.Review}>
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
