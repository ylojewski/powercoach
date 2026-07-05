import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cloneElement, isValidElement, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { type ToneOrIntentProps } from '../types/ToneOrIntentProps'
import {
  HEADING_DEFAULT_SIZE,
  headingVariants,
  type HeadingSize
} from './constants/headingVariants'

export { type HeadingSize } from './constants/headingVariants'

export type HeadingProps = useRender.ComponentProps<'span', Record<string, never>> &
  ToneOrIntentProps & {
    size?: HeadingSize
  }

export function Heading({
  className,
  intent,
  render,
  size = HEADING_DEFAULT_SIZE,
  tone,
  ...props
}: HeadingProps): ReactElement {
  const renderElement = isValidElement<{ className?: string }>(render) ? render : undefined
  const mergedClassName = twMerge(
    headingVariants({ intent, size, tone: intent === undefined ? tone : null }),
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
