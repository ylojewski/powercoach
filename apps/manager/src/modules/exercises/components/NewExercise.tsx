import * as UI from '@powercoach/ui'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  FileTextIcon,
  SaveIcon,
  Trash2Icon
} from 'lucide-react'
import { type ReactElement } from 'react'

import { useAppDispatch, useAppSelector } from '@/core'

import {
  getExerciseCreationCode,
  getNextExercisePanel,
  getPreviousExercisePanel,
  NEW_EXERCISE_PANELS
} from '../exerciseCreation'
import {
  resetCreationDraft,
  selectExerciseCreationDraft,
  selectExerciseCreationValidation,
  selectExercisesCreation,
  setCreationPanel as setCreationPanelAction
} from '../store'
import { NewExercisePanel } from '../types'
import { NewExerciseCategorizationPanel } from './NewExerciseCategorizationPanel'
import { NewExerciseInstructionsPanel } from './NewExerciseInstructionsPanel'
import { NewExerciseMusclesPanel } from './NewExerciseMusclesPanel'
import { NewExerciseOverviewPanel } from './NewExerciseOverviewPanel'
import { NewExerciseReviewPanel } from './NewExerciseReviewPanel'
import { NewExerciseSourcePanel } from './NewExerciseSourcePanel'
import { NewExerciseSpecificationsPanel } from './NewExerciseSpecificationsPanel'

export function NewExercise(): ReactElement {
  const dispatch = useAppDispatch()
  const creation = useAppSelector(selectExercisesCreation)
  const draft = useAppSelector(selectExerciseCreationDraft)
  const validation = useAppSelector(selectExerciseCreationValidation)
  const panel = creation?.panel ?? NewExercisePanel.Source
  const generatedCode = getExerciseCreationCode(draft)
  const canSaveDraft = validation.draftErrors.length === 0
  const canPublish = validation.publishErrors.length === 0

  const handleOnPanelValueChange = ([newPanel = NewExercisePanel.Source]: NewExercisePanel[]) => {
    dispatch(setCreationPanelAction(newPanel))
  }

  return (
    <div className="flex flex-1 flex-col" data-testid="exercise-catalog-new">
      <div className="relative min-h-0 flex-1 border-y border-r">
        <UI.HorizontalPanel<NewExercisePanel>
          collapsible={false}
          onValueChange={handleOnPanelValueChange}
          value={[panel]}
        >
          <UI.HorizontalPanelItem value={NewExercisePanel.Source}>
            <UI.HorizontalPanelTrigger>source</UI.HorizontalPanelTrigger>
            <UI.HorizontalPanelContent>
              <NewExerciseSourcePanel />
            </UI.HorizontalPanelContent>
          </UI.HorizontalPanelItem>
          <UI.HorizontalPanelItem value={NewExercisePanel.Overview}>
            <UI.HorizontalPanelTrigger>overview</UI.HorizontalPanelTrigger>
            <UI.HorizontalPanelContent>
              <NewExerciseOverviewPanel />
            </UI.HorizontalPanelContent>
          </UI.HorizontalPanelItem>
          <UI.HorizontalPanelItem value={NewExercisePanel.Categorization}>
            <UI.HorizontalPanelTrigger>categorization</UI.HorizontalPanelTrigger>
            <UI.HorizontalPanelContent>
              <NewExerciseCategorizationPanel />
            </UI.HorizontalPanelContent>
          </UI.HorizontalPanelItem>
          <UI.HorizontalPanelItem value={NewExercisePanel.Specifications}>
            <UI.HorizontalPanelTrigger>specifications</UI.HorizontalPanelTrigger>
            <UI.HorizontalPanelContent>
              <NewExerciseSpecificationsPanel />
            </UI.HorizontalPanelContent>
          </UI.HorizontalPanelItem>
          <UI.HorizontalPanelItem value={NewExercisePanel.Muscles}>
            <UI.HorizontalPanelTrigger>muscles</UI.HorizontalPanelTrigger>
            <UI.HorizontalPanelContent>
              <NewExerciseMusclesPanel />
            </UI.HorizontalPanelContent>
          </UI.HorizontalPanelItem>
          <UI.HorizontalPanelItem value={NewExercisePanel.Instructions}>
            <UI.HorizontalPanelTrigger>instructions</UI.HorizontalPanelTrigger>
            <UI.HorizontalPanelContent>
              <NewExerciseInstructionsPanel />
            </UI.HorizontalPanelContent>
          </UI.HorizontalPanelItem>
          <UI.HorizontalPanelItem value={NewExercisePanel.Review}>
            <UI.HorizontalPanelTrigger>review</UI.HorizontalPanelTrigger>
            <UI.HorizontalPanelContent>
              <NewExerciseReviewPanel />
            </UI.HorizontalPanelContent>
          </UI.HorizontalPanelItem>
        </UI.HorizontalPanel>
      </div>
      <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 border-r border-b bg-background p-4">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileTextIcon className="size-4" />
            {getPanelLabel(panel)}
          </div>
          <div className="line-clamp-1 text-sm text-muted-foreground">
            {generatedCode || 'new_exercise'} · {validation.publishErrors.length} publish issue(s)
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <UI.Button onClick={() => dispatch(resetCreationDraft())} variant="outline">
            Cancel
          </UI.Button>
          <UI.Button
            disabled={panel === NEW_EXERCISE_PANELS[0]}
            onClick={() => dispatch(setCreationPanelAction(getPreviousExercisePanel(panel)))}
            variant="outline"
          >
            <ArrowLeftIcon />
            Back
          </UI.Button>
          <UI.Button
            disabled={panel === NEW_EXERCISE_PANELS[NEW_EXERCISE_PANELS.length - 1]}
            onClick={() => dispatch(setCreationPanelAction(getNextExercisePanel(panel)))}
            variant="outline"
          >
            Next
            <ArrowRightIcon />
          </UI.Button>
          <div className="flex">
            <UI.Button disabled={!canSaveDraft}>
              <SaveIcon />
              Save draft
            </UI.Button>
            <UI.Menu>
              <UI.MenuTrigger
                aria-label="Save actions"
                className="ms-1 inline-flex h-9 items-center justify-center rounded-lg border border-primary bg-primary px-2 text-primary-foreground shadow-xs shadow-primary/24 hover:bg-primary/90 sm:h-8"
              >
                <ChevronDownIcon className="size-4" />
              </UI.MenuTrigger>
              <UI.MenuPopup align="end" className="min-w-52">
                <UI.MenuItem disabled={!canSaveDraft}>
                  <SaveIcon />
                  Save draft
                </UI.MenuItem>
                <UI.MenuItem disabled={!canPublish}>
                  <CheckCircle2Icon />
                  Publish
                </UI.MenuItem>
                <UI.MenuSeparator />
                <UI.MenuItem disabled variant="destructive">
                  <Trash2Icon />
                  Delete unavailable while creating
                </UI.MenuItem>
              </UI.MenuPopup>
            </UI.Menu>
          </div>
        </div>
      </div>
    </div>
  )
}

function getPanelLabel(panel: NewExercisePanel): string {
  return panel === NewExercisePanel.Source
    ? 'Source'
    : panel.charAt(0).toUpperCase() + panel.slice(1)
}
