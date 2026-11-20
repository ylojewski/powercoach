import { Drawer as BaseUiDrawer } from '@base-ui/react/drawer'
import { type ReactElement } from 'react'

import { resolveBottomSheetClassName } from '../utils/resolveBottomSheetClassName'

export type BottomSheetViewportProps = BaseUiDrawer.Viewport.Props

export type BottomSheetViewportState = BaseUiDrawer.Viewport.State

export function BottomSheetViewport({
  className,
  ...props
}: BottomSheetViewportProps): ReactElement {
  return (
    <BaseUiDrawer.Viewport
      {...props}
      className={(state) =>
        resolveBottomSheetClassName(
          className,
          state,
          `pointer-events-none absolute inset-0 flex size-full items-end justify-center`
        )
      }
    />
  )
}
