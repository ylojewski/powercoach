import {
  Drawer,
  DrawerDescription,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle
} from '@powercoach/ui'
import { type ComponentProps, PropsWithChildren, type ReactElement } from 'react'

import { NewExercise } from './NewExercise'

export function NewExerciseDrawer({
  children,
  open,
  ...props
}: PropsWithChildren<ComponentProps<typeof Drawer>>): ReactElement {
  return (
    <Drawer open={open} position="bottom" {...props}>
      <DrawerPopup showBar showCloseButton className="min-h-[calc(100dvh-4.75rem)] rounded-none">
        <DrawerHeader>
          <DrawerTitle>New exercise</DrawerTitle>
          <DrawerDescription>Create a new catalog exercise.</DrawerDescription>
        </DrawerHeader>
        <DrawerPanel scrollable={false} className="flex flex-1 flex-col">
          <NewExercise />
        </DrawerPanel>
        {children}
      </DrawerPopup>
    </Drawer>
  )
}
