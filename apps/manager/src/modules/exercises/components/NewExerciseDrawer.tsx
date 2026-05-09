import {
  DrawerDescription,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle
} from '@powercoach/ui'
import { type ReactElement } from 'react'

import { useRouterConfig, RoutedDrawer } from '@/core'

import { NewExercise } from './NewExercise'

export function NewExerciseDrawer(): ReactElement {
  const RouterConfig = useRouterConfig()

  return (
    <RoutedDrawer
      fallbackPathname={RouterConfig.Exercises.Index}
      pathname={RouterConfig.Exercises.New}
      position="bottom"
    >
      <DrawerPopup showBar showCloseButton className="min-h-[calc(100dvh-4.75rem)] rounded-none">
        <DrawerHeader>
          <DrawerTitle>New exercise</DrawerTitle>
          <DrawerDescription>Create a new catalog exercise.</DrawerDescription>
        </DrawerHeader>
        <DrawerPanel scrollable={false} className="flex flex-1 flex-col">
          <NewExercise />
        </DrawerPanel>
      </DrawerPopup>
    </RoutedDrawer>
  )
}
