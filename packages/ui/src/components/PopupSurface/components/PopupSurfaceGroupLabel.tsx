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

export type PopupSurfaceGroupLabelState = Record<string, never>

type PopupSurfaceGroupLabelBaseProps = useRender.ComponentProps<
  'div',
  PopupSurfaceGroupLabelState,
  ComponentPropsWithRef<'div'>
>

export type PopupSurfaceGroupLabelProps = Omit<
  PopupSurfaceGroupLabelBaseProps,
  'className' | 'ref' | 'style'
> & {
  className?: string | ((state: PopupSurfaceGroupLabelState) => string | undefined)
  ref?: Ref<HTMLElement>
  style?: CSSProperties | ((state: PopupSurfaceGroupLabelState) => CSSProperties | undefined)
}

export function PopupSurfaceGroupLabel({
  className,
  render,
  style,
  ...props
}: PopupSurfaceGroupLabelProps): ReactElement | null {
  const state = {}
  const renderElement = isValidElement<{ className?: string; style?: CSSProperties }>(render)
    ? render
    : undefined
  const consumerClassName = typeof className === 'function' ? className(state) : className
  const consumerStyle = typeof style === 'function' ? style(state) : style
  const mergedClassName = twMerge(renderElement?.props.className, consumerClassName)

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: mergedClassName || undefined,
        'data-popup-surface-group-label': '',
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
