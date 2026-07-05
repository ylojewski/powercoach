import { Drawer as BaseUiDrawer } from '@base-ui/react/drawer'
import { type ReactElement } from 'react'

import { resolveBottomSheetClassName } from '../utils/resolveBottomSheetClassName'

export type BottomSheetContentProps = BaseUiDrawer.Content.Props

export type BottomSheetContentState = BaseUiDrawer.Content.State

export function BottomSheetContent({ className, ...props }: BottomSheetContentProps): ReactElement {
  return (
    <BaseUiDrawer.Content
      {...props}
      className={(state) =>
        resolveBottomSheetClassName(
          className,
          state,
          // prettier-ignore
          `
            relative z-10 mx-auto w-full max-w-[32rem]
            opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.45,1.005,0,1.005)]
            group-data-nested-drawer-open/popup:opacity-[var(--stack-progress)]
            group-data-nested-drawer-swiping/popup:duration-0
            motion-reduce:duration-0
          `
        )
      }
    />
  )
}
