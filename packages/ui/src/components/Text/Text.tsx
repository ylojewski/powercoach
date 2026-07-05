import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cloneElement, isValidElement, type ComponentPropsWithRef, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { type ToneOrIntentProps } from '../types/ToneOrIntentProps'
import { TEXT_DEFAULT_SIZE, textVariants, type TextSize } from './constants/textVariants'

export type TextProps = useRender.ComponentProps<
  'span',
  Record<string, never>,
  ComponentPropsWithRef<'span'>
> &
  ToneOrIntentProps & {
    size?: TextSize
  }

export function Text({
  className,
  intent,
  render,
  size = TEXT_DEFAULT_SIZE,
  tone,
  ...props
}: TextProps): ReactElement | null {
  const renderElement = isValidElement<{ className?: string }>(render) ? render : undefined
  const mergedClassName = twMerge(
    textVariants({ intent, size, tone: intent === undefined ? tone : null }),
    className,
    renderElement?.props.className
  )

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>({ className: mergedClassName }, props),
    render: renderElement ? cloneElement(renderElement, { className: undefined }) : render,
    state: {}
  })
}
