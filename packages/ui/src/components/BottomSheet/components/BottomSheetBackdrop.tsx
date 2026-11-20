import { Drawer as BaseUiDrawer } from '@base-ui/react/drawer'
import { type ReactElement } from 'react'

import { resolveBottomSheetClassName } from '../utils/resolveBottomSheetClassName'

export type BottomSheetBackdropProps = Omit<BaseUiDrawer.Backdrop.Props, 'forceRender'>

export type BottomSheetBackdropState = BaseUiDrawer.Backdrop.State

export function BottomSheetBackdrop({
  className,
  ...props
}: BottomSheetBackdropProps): ReactElement {
  return (
    <BaseUiDrawer.Backdrop
      {...props}
      className={(state) =>
        resolveBottomSheetClassName(
          className,
          state,
          // prettier-ignore
          `
            pointer-events-auto absolute inset-0 min-h-full
            bg-black opacity-[calc(0.2*(1-var(--drawer-swipe-progress)))]
            transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)]
            data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0
            data-ending-style:data-swipe-dismiss:duration-[calc(var(--drawer-swipe-strength)*400ms)]
            dark:opacity-[calc(0.7*(1-var(--drawer-swipe-progress)))]
            motion-reduce:duration-0
          `
        )
      }
      forceRender={false}
    />
  )
}
