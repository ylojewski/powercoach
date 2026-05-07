import {
  DrawerDescription,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle
} from '@powercoach/ui'
import { type ReactElement } from 'react'
import { Outlet } from 'react-router'

import { RoutedDrawer } from '@/shared/components'

import { ExerciseCatalog } from './ExerciseCatalog'

export function ExerciseDrawer(): ReactElement {
  return (
    <RoutedDrawer closeTo=".." matchDescendants>
      <DrawerPopup showBar showCloseButton className="min-h-[calc(100dvh-4.75rem)] rounded-none">
        <DrawerHeader>
          <DrawerTitle>Exercise</DrawerTitle>
          <DrawerDescription>Browse the exercise catalog.</DrawerDescription>
        </DrawerHeader>
        <DrawerPanel scrollable>
          <ExerciseCatalog />
        </DrawerPanel>
        <Outlet />
      </DrawerPopup>
    </RoutedDrawer>
  )
}
