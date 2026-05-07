import {
  DrawerDescription,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle
} from '@powercoach/ui'
import { type ReactElement } from 'react'

import { RoutedDrawer } from '@/shared/components'

import { NewCatalogExercise } from './NewCatalogExercise'

export function NewCatalogExerciseDrawer(): ReactElement {
  return (
    <RoutedDrawer closeTo="..">
      <DrawerPopup showBar showCloseButton className="min-h-[calc(100dvh-4.75rem)] rounded-none">
        <DrawerHeader>
          <DrawerTitle>New exercise</DrawerTitle>
          <DrawerDescription>Create a new catalog exercise.</DrawerDescription>
        </DrawerHeader>
        <DrawerPanel scrollable>
          <NewCatalogExercise />
        </DrawerPanel>
      </DrawerPopup>
    </RoutedDrawer>
  )
}
