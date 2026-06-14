import {
  cn,
  HorizontalPanel,
  HorizontalPanelContent,
  HorizontalPanelItem,
  HorizontalPanelTrigger
} from '@powercoach/ui'
import { type ReactElement, useState } from 'react'

import { useExerciseCreation } from '../hooks'
import { Step } from '../store'
import { NewExerciseCategorizationStep } from './NewExerciseCategorizationStep'
import { NewExerciseInstructionsStep } from './NewExerciseInstructionsStep'
import { NewExerciseMusclesStep } from './NewExerciseMusclesStep'
import { NewExerciseOverviewStep } from './NewExerciseOverviewStep'
import { NewExerciseReviewStep } from './NewExerciseReviewStep'
import { NewExerciseStartStep } from './NewExerciseStartStep'
import { NewExerciseTrackingStep } from './NewExerciseTrackingStep'

const STEP_ORDER = [
  Step.Start,
  Step.Overview,
  Step.Categorization,
  Step.Tracking,
  Step.Muscles,
  Step.Instructions,
  Step.Review
]

export function NewExercise(): ReactElement {
  const { canGoToNextStep } = useExerciseCreation()
  const [step, setStep] = useState(Step.Start)

  const goToStep = (newStep: Step) => {
    setStep(newStep)
  }

  const onHorizontalPanelValueChange = ([newStep = Step.Start]: Step[]) => {
    goToStep(newStep)
  }

  const start = () => {
    goToStep(Step.Overview)
  }

  const next = () => {
    if (!canGoToNextStep(step)) {
      return
    }

    const currentStepIndex = STEP_ORDER.indexOf(step)
    const nextStep = STEP_ORDER[currentStepIndex + 1]

    if (nextStep) {
      goToStep(nextStep)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col" data-testid="new-exercise">
      <div className={cn('relative min-h-0 flex-1 border-y', step === Step.Review && 'border-r')}>
        <HorizontalPanel<Step>
          collapsible={false}
          onValueChange={onHorizontalPanelValueChange}
          value={[step]}
        >
          <HorizontalPanelItem value={Step.Start}>
            <HorizontalPanelTrigger>start</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseStartStep onStart={start} />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Overview}>
            <HorizontalPanelTrigger>overview</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseOverviewStep canNext={canGoToNextStep(Step.Overview)} onNext={next} />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Categorization}>
            <HorizontalPanelTrigger>categorization</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseCategorizationStep
                canNext={canGoToNextStep(Step.Categorization)}
                onNext={next}
              />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Tracking}>
            <HorizontalPanelTrigger>tracking</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseTrackingStep canNext={canGoToNextStep(Step.Tracking)} onNext={next} />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Muscles}>
            <HorizontalPanelTrigger>muscles</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseMusclesStep canNext={canGoToNextStep(Step.Muscles)} onNext={next} />
            </HorizontalPanelContent>
          </HorizontalPanelItem>
          <HorizontalPanelItem value={Step.Instructions}>
            <HorizontalPanelTrigger>instructions</HorizontalPanelTrigger>
            <HorizontalPanelContent>
              <NewExerciseInstructionsStep
                canNext={canGoToNextStep(Step.Instructions)}
                onNext={next}
              />
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
    </div>
  )
}
