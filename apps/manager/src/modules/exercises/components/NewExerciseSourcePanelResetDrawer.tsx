import {
  Button,
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle
} from '@powercoach/ui'
import { TriangleAlertIcon } from 'lucide-react'
import { ComponentProps, type ReactElement } from 'react'

export interface NewExerciseSourcePanelResetDrawerProps extends ComponentProps<typeof Drawer> {
  confirmText: string
  onConfirm: () => void
}

export function NewExerciseSourcePanelResetDrawer({
  confirmText,
  handle,
  onConfirm,
  ...props
}: NewExerciseSourcePanelResetDrawerProps): ReactElement<ComponentProps<typeof Drawer>> {
  return (
    <Drawer handle={handle} position="bottom" {...props}>
      <DrawerPopup showBar showCloseButton className="min-h-[calc(100dvh-4.75rem)] rounded-none">
        <DrawerPanel
          className="flex min-h-full flex-1 items-center justify-center"
          scrollable={false}
        >
          <div className="flex max-w-md flex-col items-center text-center">
            <TriangleAlertIcon
              aria-hidden="true"
              className="text-destructive mb-6 size-20 stroke-[1.25]"
            />
            <DrawerTitle className="mb-3 text-3xl">creation already in progress</DrawerTitle>
            <DrawerDescription className="mb-3">
              Starting from this source will reset the current wizard and replace the exercise being
              created.
            </DrawerDescription>
            <p className="text-muted-foreground mb-8 text-sm">
              Your current changes in the wizard will be discarded.
            </p>
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <DrawerClose render={<Button />} onClick={onConfirm}>
                {confirmText}
              </DrawerClose>
              <DrawerClose render={<Button variant="outline" />}>Keep editing</DrawerClose>
            </div>
          </div>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  )
}
