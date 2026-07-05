import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import {
  cloneElement,
  isValidElement,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactElement,
  type Ref
} from 'react'
import { twMerge } from 'tailwind-merge'

import { POPUP_SURFACE_HARD_SHADOWS } from '../constants/popupSurfaceVariants'
import { type PopupSurfaceSize } from '../types/PopupSurfaceTypes'

export interface PopupSurfaceRootState {
  size: PopupSurfaceSize
}

type PopupSurfaceRootBaseProps = useRender.ComponentProps<
  'div',
  PopupSurfaceRootState,
  ComponentPropsWithRef<'div'>
>

export type PopupSurfaceRootProps = Omit<
  PopupSurfaceRootBaseProps,
  'className' | 'ref' | 'style'
> & {
  className?: string | ((state: PopupSurfaceRootState) => string | undefined)
  ref?: Ref<HTMLElement>
  size: PopupSurfaceSize
  style?: CSSProperties | ((state: PopupSurfaceRootState) => CSSProperties | undefined)
}

export function PopupSurfaceRoot({
  className,
  render,
  size,
  style,
  ...props
}: PopupSurfaceRootProps): ReactElement | null {
  const state = { size }
  const renderElement = isValidElement<{ className?: string; style?: CSSProperties }>(render)
    ? render
    : undefined
  const consumerClassName = typeof className === 'function' ? className(state) : className
  const consumerStyle = typeof style === 'function' ? style(state) : style

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: twMerge(
          // prettier-ignore
          `
            box-border border border-foreground bg-background text-foreground
            shadow-(--hard-shadow) outline-none
            origin-[var(--transform-origin)] scale-100 opacity-100
            transition-[scale,opacity,width,height]
            [transition-duration:var(--popup-surface-enter-duration),var(--popup-surface-enter-duration),var(--popup-surface-layout-duration),var(--popup-surface-layout-duration)]
            [transition-timing-function:var(--popup-surface-enter-easing),var(--popup-surface-enter-easing),var(--popup-surface-layout-easing),var(--popup-surface-layout-easing)]
            data-starting-style:scale-90 data-starting-style:opacity-0
            data-ending-style:scale-90 data-ending-style:opacity-0
            data-ending-style:[transition-duration:var(--popup-surface-exit-duration),var(--popup-surface-exit-duration),var(--popup-surface-layout-duration),var(--popup-surface-layout-duration)]
            data-ending-style:[transition-timing-function:var(--popup-surface-exit-easing),var(--popup-surface-exit-easing),var(--popup-surface-layout-easing),var(--popup-surface-layout-easing)]
            motion-reduce:duration-0 motion-reduce:data-ending-style:duration-0
          `,
          renderElement?.props.className,
          consumerClassName
        ),
        'data-popup-surface-root': '',
        'data-size': size,
        style: {
          '--hard-shadow': POPUP_SURFACE_HARD_SHADOWS[size],
          '--popup-surface-enter-duration': '350ms',
          '--popup-surface-enter-easing': 'cubic-bezier(0.22, 1, 0.36, 1)',
          '--popup-surface-exit-duration': '150ms',
          '--popup-surface-exit-easing': 'ease',
          '--popup-surface-layout-duration': '0ms',
          '--popup-surface-layout-easing': 'cubic-bezier(0.22, 1, 0.36, 1)',
          ...renderElement?.props.style,
          ...consumerStyle
        } as CSSProperties
      } as ComponentPropsWithRef<'div'>,
      props as unknown as ComponentPropsWithRef<'div'>
    ),
    render: renderElement
      ? cloneElement(renderElement, { className: undefined, style: undefined })
      : render,
    state
  })
}
