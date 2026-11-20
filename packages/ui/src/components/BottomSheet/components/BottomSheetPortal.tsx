import { Drawer as BaseUiDrawer } from '@base-ui/react/drawer'
import { useContext, type ReactElement } from 'react'

import { bottomSheetPortalContainerContext } from '../constants/bottomSheetPortalContainerContext'
import { resolveBottomSheetClassName } from '../utils/resolveBottomSheetClassName'

export type BottomSheetPortalProps = Omit<BaseUiDrawer.Portal.Props, 'container'>

export type BottomSheetPortalState = BaseUiDrawer.Portal.State

export function BottomSheetPortal({ className, ...props }: BottomSheetPortalProps): ReactElement {
  const portalContainerRef = useContext(bottomSheetPortalContainerContext)

  return (
    <BaseUiDrawer.Portal
      {...props}
      className={(state) =>
        resolveBottomSheetClassName(
          className,
          state,
          `pointer-events-none absolute inset-0 overflow-clip`
        )
      }
      container={portalContainerRef}
    />
  )
}
