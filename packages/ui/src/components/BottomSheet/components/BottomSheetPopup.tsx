import { Drawer as BaseUiDrawer } from '@base-ui/react/drawer'
import { cloneElement, createElement, useImperativeHandle, useRef, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { resolveBottomSheetClassName } from '../utils/resolveBottomSheetClassName'

export type BottomSheetPopupProps = BaseUiDrawer.Popup.Props

export type BottomSheetPopupState = BaseUiDrawer.Popup.State

export function BottomSheetPopup({
  children,
  className,
  hidden: _hidden,
  initialFocus,
  ref,
  render,
  role: _role,
  ...props
}: BottomSheetPopupProps): ReactElement {
  const popupRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => popupRef.current as HTMLDivElement)

  const protectedRender: BottomSheetPopupProps['render'] =
    typeof render === 'function'
      ? (renderProps, state) => {
          const renderedElement = render(renderProps, state) as ReactElement<
            Record<string, unknown>
          >

          return cloneElement(renderedElement, {
            'aria-modal': renderProps['aria-modal'],
            hidden: renderProps.hidden,
            role: renderProps.role
          })
        }
      : render === undefined
        ? undefined
        : (() => {
            const renderedElement = render as ReactElement<Record<string, unknown>>
            const renderElementProps = { ...renderedElement.props }

            delete renderElementProps['aria-modal']
            delete renderElementProps.hidden
            delete renderElementProps.role

            return createElement(renderedElement.type, {
              ...renderElementProps,
              key: renderedElement.key
            })
          })()

  return (
    <BaseUiDrawer.Popup
      {...props}
      aria-modal="true"
      className={(state) =>
        resolveBottomSheetClassName(
          twMerge(
            'shadow-(--hard-shadow)',
            typeof className === 'function' ? className(state) : className
          ),
          state,
          // prettier-ignore
          `
            group/popup pointer-events-auto relative box-border
            -mx-px -mb-[3rem]
            h-[calc(100%-2.2rem-env(safe-area-inset-top,0px)+3rem)] w-[calc(100%+2px)]
            overflow-y-auto overscroll-contain touch-auto
            border border-foreground bg-background px-6 pt-4
            pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+3rem)] text-foreground
            outline-none
            [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-step:0.05]
            [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*1rem))]
            [--scale-base:max(0,calc(1-(var(--nested-drawers)*var(--stack-step))))]
            [--scale:clamp(0,calc(var(--scale-base)+(var(--stack-step)*var(--stack-progress))),1)]
            [--shrink:calc(1-var(--scale))]
            [--stack-height:max(0px,calc(var(--drawer-frontmost-height,var(--drawer-height))-3rem))]
            [transform-origin:50%_calc(100%-3rem)]
            [transform:translateY(calc(var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--shrink)*var(--stack-height))))_scale(var(--scale))]
            [transition:transform_450ms_cubic-bezier(0.32,0.72,0,1),height_450ms_cubic-bezier(0.32,0.72,0,1),opacity_450ms_cubic-bezier(0.32,0.72,0,1)]
            after:pointer-events-none after:absolute after:inset-0 after:bg-black after:opacity-0 after:content-['']
            after:transition-opacity after:duration-[450ms] after:ease-[cubic-bezier(0.32,0.72,0,1)]
            data-swiping:select-none data-swiping:duration-0
            data-starting-style:[transform:translateY(calc(100%-3rem+2px))]
            data-ending-style:[transform:translateY(calc(100%-3rem+2px))]
            data-ending-style:data-swipe-dismiss:duration-[calc(var(--drawer-swipe-strength)*400ms)]
            data-nested-drawer-open:h-[calc(var(--stack-height)+3rem)]
            data-nested-drawer-open:overflow-hidden
            data-nested-drawer-open:after:opacity-[calc(0.05*(1-var(--stack-progress)))]
            data-nested-drawer-swiping:duration-0 data-nested-drawer-swiping:after:duration-0
            motion-reduce:duration-0 motion-reduce:after:duration-0
          `
        )
      }
      initialFocus={
        initialFocus ?? ((openType) => (openType === 'touch' ? popupRef.current : true))
      }
      ref={popupRef}
      render={protectedRender}
    >
      <div
        aria-hidden="true"
        className={
          // prettier-ignore
          `
            pointer-events-none relative z-10 mx-auto mb-4 h-1 w-12 shrink-0 bg-foreground
            opacity-100 transition-opacity duration-200
            group-data-nested-drawer-open/popup:opacity-[var(--stack-progress)]
            group-data-nested-drawer-swiping/popup:duration-0
            motion-reduce:duration-0
          `
        }
      />
      {children}
    </BaseUiDrawer.Popup>
  )
}
