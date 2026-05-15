import {
  Drawer,
  DrawerCreateHandle,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle
} from '@powercoach/ui'
import { type ComponentProps, type ReactElement } from 'react'

export type MuscleSelectorDrawerProps = ComponentProps<typeof Drawer> & {
  handle: ReturnType<typeof DrawerCreateHandle>
}

export function NewExerciseMuscleSelectorDrawer({
  handle,
  ...props
}: MuscleSelectorDrawerProps): ReactElement {
  return (
    <Drawer handle={handle} {...props}>
      <DrawerPopup showBar showCloseButton className="min-h-[calc(100dvh-4.75rem)] rounded-none">
        <DrawerHeader>
          <DrawerTitle>Muscle selection</DrawerTitle>
        </DrawerHeader>
        <DrawerPanel className="flex min-h-full flex-col gap-4" scrollable>
          MuscleSelectorDrawer
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  )
}
