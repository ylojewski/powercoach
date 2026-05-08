import {
  DrawerDescription,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle
} from '@powercoach/ui'
import { type ReactElement } from 'react'

import { RouterPath, RoutedDrawer } from '@/core'

import { Exercises } from './Exercises'
import { NewExerciseDrawer } from './NewExerciseDrawer'

export function ExercisesDrawer(): ReactElement {
  return (
    <RoutedDrawer
      fallbackPathname={RouterPath.Home}
      pathname={RouterPath.Exercise}
      position="bottom"
    >
      <DrawerPopup showBar showCloseButton className="min-h-[calc(100dvh-4.75rem)] rounded-none">
        <DrawerHeader>
          <DrawerTitle>Exercise</DrawerTitle>
          <DrawerDescription>Browse the exercise catalog.</DrawerDescription>
        </DrawerHeader>
        <DrawerPanel scrollable>
          <Exercises />
        </DrawerPanel>
        <NewExerciseDrawer />
      </DrawerPopup>
    </RoutedDrawer>
  )
}
