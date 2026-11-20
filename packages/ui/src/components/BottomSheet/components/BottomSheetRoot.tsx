import { Drawer as BaseUiDrawer } from '@base-ui/react/drawer'
import { type ReactElement, type ReactNode } from 'react'

export type BottomSheetRootState = BaseUiDrawer.Root.State

export type BottomSheetRootChangeEventReason = BaseUiDrawer.Root.ChangeEventReason

export type BottomSheetRootChangeEventDetails = BaseUiDrawer.Root.ChangeEventDetails

export interface BottomSheetRootProps {
  children?: ReactNode
  defaultOpen?: boolean
  disablePointerDismissal?: boolean
  onOpenChange?: (open: boolean, eventDetails: BottomSheetRootChangeEventDetails) => void
  onOpenChangeComplete?: (open: boolean) => void
  open?: boolean
}

export function BottomSheetRoot({ children, ...props }: BottomSheetRootProps): ReactElement {
  return (
    <BaseUiDrawer.Root
      {...props}
      actionsRef={undefined}
      defaultSnapPoint={undefined}
      defaultTriggerId={undefined}
      handle={undefined}
      modal
      onSnapPointChange={undefined}
      snapPoint={undefined}
      snapPoints={undefined}
      snapToSequentialPoints={undefined}
      swipeDirection="down"
      triggerId={undefined}
    >
      {typeof children === 'function' ? null : children}
    </BaseUiDrawer.Root>
  )
}
