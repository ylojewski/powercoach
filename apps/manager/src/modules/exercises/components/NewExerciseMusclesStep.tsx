import { Button, DrawerPrimitive, DrawerTrigger } from '@powercoach/ui'
import { type ReactElement } from 'react'

import { NewExerciseMuscleSelectorDrawer } from './NewExerciseMuscleSelectorDrawer'
import { NewExerciseStepFooter, type NewExerciseStepFooterProps } from './NewExerciseStepFooter'

export function NewExerciseMusclesStep({
  canNext,
  onNext
}: NewExerciseStepFooterProps): ReactElement {
  const drawerHandle = DrawerPrimitive.createHandle()
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 p-6">
        <div>Muscles</div>
        <DrawerTrigger handle={drawerHandle} render={<Button>Add muscles</Button>} />
      </div>
      <NewExerciseMuscleSelectorDrawer handle={drawerHandle} />
      <NewExerciseStepFooter canNext={canNext} onNext={onNext} />
    </div>
  )
}
