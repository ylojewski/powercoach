import {
  Drawer,
  DrawerDescription,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle
} from '@powercoach/ui'
import { type ComponentProps, PropsWithChildren, type ReactElement } from 'react'

import { Exercises } from './Exercises'

export function ExercisesDrawer({
  children,
  open,
  ...props
}: PropsWithChildren<ComponentProps<typeof Drawer>>): ReactElement {
  return (
    <Drawer open={open} position="bottom" {...props}>
      <DrawerPopup showBar showCloseButton className="min-h-[calc(100dvh-4.75rem)] rounded-none">
        <DrawerHeader>
          <DrawerTitle>Exercise</DrawerTitle>
          <DrawerDescription>Browse the exercise catalog.</DrawerDescription>
        </DrawerHeader>
        <DrawerPanel className="min-h-full" scrollable>
          <Exercises />
        </DrawerPanel>
        {children}
      </DrawerPopup>
    </Drawer>
  )
}
