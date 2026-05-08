import {
  Drawer,
  DrawerDescription,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle
} from '@powercoach/ui'
import { type ReactElement } from 'react'
import { useNavigate } from 'react-router'

import { RouterPath, useBackgroundLocationState, useRoutedDrawerTransition } from '@/app'

import { ExerciseCatalog } from './ExerciseCatalog'
import { NewCatalogExerciseDrawer } from './NewCatalogExerciseDrawer'

export function ExerciseDrawer(): ReactElement {
  const navigate = useNavigate()
  const backgroundLocationState = useBackgroundLocationState()
  const { drawerTransitionOverlay, isOpened, setIsOpened } = useRoutedDrawerTransition({
    matchDescendants: true,
    pathname: RouterPath.Exercise
  })

  const handleOpenChange = (open: boolean): void => {
    if (open) {
      return
    }

    setIsOpened(false)
    if (backgroundLocationState?.backgroundLocation) {
      navigate(-1)
      return
    }

    navigate(RouterPath.Home)
  }

  return (
    <>
      {drawerTransitionOverlay}
      <Drawer onOpenChange={handleOpenChange} open={isOpened} position="bottom">
        <DrawerPopup showBar showCloseButton className="min-h-[calc(100dvh-4.75rem)] rounded-none">
          <DrawerHeader>
            <DrawerTitle>Exercise</DrawerTitle>
            <DrawerDescription>Browse the exercise catalog.</DrawerDescription>
          </DrawerHeader>
          <DrawerPanel scrollable>
            <ExerciseCatalog />
          </DrawerPanel>
          <NewCatalogExerciseDrawer />
        </DrawerPopup>
      </Drawer>
    </>
  )
}
