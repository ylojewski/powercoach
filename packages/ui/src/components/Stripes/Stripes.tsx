import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { type CSSProperties, type ReactElement } from 'react'

export interface StripesProps extends useRender.ComponentProps<'div', Record<string, never>> {
  [dataAttribute: `data-${string}`]: unknown
  angle?: string
  color?: string
  gap?: string
  width?: string
}

export function Stripes({
  angle,
  color,
  gap,
  render,
  style,
  width,
  ...props
}: StripesProps): ReactElement | null {
  const backgroundStyle = {
    backgroundImage: `repeating-linear-gradient(
      var(--stripes-angle, 135deg),
      var(--stripes-color, var(--muted)) 0,
      var(--stripes-color, var(--muted)) var(--stripes-width, 4px),
      transparent var(--stripes-width, 4px),
      transparent calc(var(--stripes-width, 4px) + var(--stripes-gap, 3px))
    )`
  } satisfies CSSProperties
  const namedOverrideStyle = {} as CSSProperties &
    Partial<{
      '--stripes-angle': string
      '--stripes-color': string
      '--stripes-gap': string
      '--stripes-width': string
    }>

  if (angle !== undefined) {
    namedOverrideStyle['--stripes-angle'] = angle
  }

  if (color !== undefined) {
    namedOverrideStyle['--stripes-color'] = color
  }

  if (gap !== undefined) {
    namedOverrideStyle['--stripes-gap'] = gap
  }

  if (width !== undefined) {
    namedOverrideStyle['--stripes-width'] = width
  }

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      props,
      {
        style
      },
      {
        style: backgroundStyle
      },
      {
        style: namedOverrideStyle as CSSProperties
      }
    ),
    render,
    state: {}
  })
}
