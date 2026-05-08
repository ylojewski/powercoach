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

import { NewExercise } from './NewExercise'

export function NewExerciseDrawer(): ReactElement {
  const navigate = useNavigate()
  const backgroundLocationState = useBackgroundLocationState()
  const { drawerTransitionOverlay, isOpened, setIsOpened } = useRoutedDrawerTransition({
    pathname: RouterPath.ExerciseNew
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

    navigate(RouterPath.Exercise)
  }

  return (
    <>
      {drawerTransitionOverlay}
      <Drawer onOpenChange={handleOpenChange} open={isOpened} position="bottom">
        <DrawerPopup showBar showCloseButton className="min-h-[calc(100dvh-4.75rem)] rounded-none">
          <DrawerHeader>
            <DrawerTitle>New exercise</DrawerTitle>
            <DrawerDescription>Create a new catalog exercise.</DrawerDescription>
          </DrawerHeader>
          <DrawerPanel scrollable>
            <NewExercise />
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
    </>
  )
}
