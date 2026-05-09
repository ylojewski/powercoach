import {
  DrawerDescription,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle
} from '@powercoach/ui'
import { type ReactElement } from 'react'

import { useRouterConfig, RoutedDrawer } from '@/core'

import { Exercises } from './Exercises'
import { NewExerciseDrawer } from './NewExerciseDrawer'

export function ExercisesDrawer(): ReactElement {
  const RouterConfig = useRouterConfig()

  return (
    <RoutedDrawer
      fallbackPathname={RouterConfig.Home.Index}
      pathname={RouterConfig.Exercises.Index}
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
