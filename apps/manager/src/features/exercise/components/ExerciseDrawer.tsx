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

import { RouterPath, useRoutedDrawerTransition } from '@/core'

import { ExerciseCatalog } from './ExerciseCatalog'

export function ExerciseDrawer(): ReactElement {
  const navigate = useNavigate()
  const { drawerTransitionOverlay, isOpened, setIsOpened } = useRoutedDrawerTransition({
    pathname: RouterPath.Exercise
  })

  const handleOpenChange = (): void => {
    setIsOpened(false)
    navigate(-1)
  }

  return (
    <>
      {drawerTransitionOverlay}
      <Drawer onOpenChange={handleOpenChange} open={isOpened} position="bottom">
        <DrawerPopup showBar className="min-h-[calc(100dvh-4.75rem)] rounded-none">
          <DrawerHeader>
            <DrawerTitle>Exercise</DrawerTitle>
            <DrawerDescription>Browse the exercise catalog.</DrawerDescription>
          </DrawerHeader>
          <DrawerPanel scrollable>
            <ExerciseCatalog />
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
    </>
  )
}
