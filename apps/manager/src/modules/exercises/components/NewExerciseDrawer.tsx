import {
  DrawerDescription,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle
} from '@powercoach/ui'
import { type ReactElement } from 'react'

import { RouterPath, RoutedDrawer } from '@/app'

import { NewExercise } from './NewExercise'

export function NewExerciseDrawer(): ReactElement {
  return (
    <RoutedDrawer
      fallbackPathname={RouterPath.Exercise}
      pathname={RouterPath.ExerciseNew}
      position="bottom"
    >
      <DrawerPopup showBar showCloseButton className="min-h-[calc(100dvh-4.75rem)] rounded-none">
        <DrawerHeader>
          <DrawerTitle>New exercise</DrawerTitle>
          <DrawerDescription>Create a new catalog exercise.</DrawerDescription>
        </DrawerHeader>
        <DrawerPanel scrollable>
          <NewExercise />
        </DrawerPanel>
      </DrawerPopup>
    </RoutedDrawer>
  )
}
