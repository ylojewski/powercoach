import { Drawer as BaseUiDrawer } from '@base-ui/react/drawer'
import { useRef, type ReactElement } from 'react'

import { bottomSheetPortalContainerContext } from '../constants/bottomSheetPortalContainerContext'
import { resolveBottomSheetClassName } from '../utils/resolveBottomSheetClassName'

export type BottomSheetSurfaceProps = BaseUiDrawer.Indent.Props

export type BottomSheetSurfaceState = BaseUiDrawer.Indent.State

export function BottomSheetSurface({ className, ...props }: BottomSheetSurfaceProps): ReactElement {
  const portalContainerRef = useRef<HTMLDivElement>(null)

  return (
    <BaseUiDrawer.Provider>
      <bottomSheetPortalContainerContext.Provider value={portalContainerRef}>
        <div ref={portalContainerRef} className="relative w-full overflow-clip">
          <BaseUiDrawer.IndentBackground className="pointer-events-none absolute inset-0 bg-black dark:bg-neutral-300" />
          <BaseUiDrawer.Indent
            {...props}
            className={(state) =>
              resolveBottomSheetClassName(
                className,
                state,
                // prettier-ignore
                `
                  relative size-full min-h-0 min-w-0 overflow-hidden
                  bg-background text-foreground
                  origin-[center_top] will-change-transform
                  [transform:scale(1)_translateY(0)]
                  [transition:transform_calc(400ms*(1-clamp(0,calc(var(--drawer-swipe-progress)*100000),1)))_cubic-bezier(0.32,0.72,0,1)]
                  data-active:[transform:scale(1)_translateY(calc(-2rem*(1-var(--drawer-swipe-progress))))]
                  motion-reduce:[transition-duration:0ms]
                `
              )
            }
          />
        </div>
      </bottomSheetPortalContainerContext.Provider>
    </BaseUiDrawer.Provider>
  )
}
