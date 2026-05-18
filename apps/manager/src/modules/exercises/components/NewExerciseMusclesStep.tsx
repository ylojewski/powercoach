import { Button, DrawerPrimitive, DrawerTrigger } from '@powercoach/ui'
import { type ReactElement } from 'react'

import { NewExerciseMuscleSelectorDrawer } from './NewExerciseMuscleSelectorDrawer'

export function NewExerciseMusclesStep(): ReactElement {
  const drawerHandle = DrawerPrimitive.createHandle()
  return (
    <>
      <div>Muscles</div>
      <DrawerTrigger handle={drawerHandle} render={<Button>Add muscles</Button>} />
      <NewExerciseMuscleSelectorDrawer handle={drawerHandle} />
    </>
  )
}
