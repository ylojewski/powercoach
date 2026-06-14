import { type ReactElement } from 'react'

import { NewExerciseStepFooter, type NewExerciseStepFooterProps } from './NewExerciseStepFooter'

export function NewExerciseTrackingStep({
  canNext,
  onNext
}: NewExerciseStepFooterProps): ReactElement {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 p-6">Tracking</div>
      <NewExerciseStepFooter canNext={canNext} onNext={onNext} />
    </div>
  )
}
