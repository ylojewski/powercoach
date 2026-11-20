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

export type PopupSurfaceGroupState = Record<string, never>

type PopupSurfaceGroupBaseProps = useRender.ComponentProps<
  'div',
  PopupSurfaceGroupState,
  ComponentPropsWithRef<'div'>
>

export type PopupSurfaceGroupProps = Omit<
  PopupSurfaceGroupBaseProps,
  'className' | 'ref' | 'style'
> & {
  className?: string | ((state: PopupSurfaceGroupState) => string | undefined)
  ref?: Ref<HTMLElement>
  style?: CSSProperties | ((state: PopupSurfaceGroupState) => CSSProperties | undefined)
}

export function PopupSurfaceGroup({
  className,
  render,
  style,
  ...props
}: PopupSurfaceGroupProps): ReactElement | null {
  const state = {}
  const renderElement = isValidElement<{ className?: string; style?: CSSProperties }>(render)
    ? render
    : undefined
  const consumerClassName = typeof className === 'function' ? className(state) : className
  const consumerStyle = typeof style === 'function' ? style(state) : style

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: twMerge('w-full', renderElement?.props.className, consumerClassName),
        'data-popup-surface-group': '',
        style: {
          ...renderElement?.props.style,
          ...consumerStyle
        }
      } as ComponentPropsWithRef<'div'>,
      props as unknown as ComponentPropsWithRef<'div'>
    ),
    render: renderElement
      ? cloneElement(renderElement, { className: undefined, style: undefined })
      : render,
    state
  })
}
