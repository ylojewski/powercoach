import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { type CSSProperties, type ReactElement } from 'react'

export interface AspectRatioProps extends useRender.ComponentProps<'div', Record<string, never>> {
  fit?: 'contain' | 'cover'
  ratio: number
}

export function AspectRatio({
  fit = 'cover',
  ratio,
  render,
  style,
  ...props
}: AspectRatioProps): ReactElement | null {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: `
          relative aspect-(--aspect-ratio) overflow-hidden
          [&>:is(img,svg,video)]:size-full
        `,
        style: {
          '--aspect-ratio': ratio
        } as CSSProperties
      },
      fit === 'contain'
        ? { className: '[&>:is(img,svg,video)]:object-contain' }
        : { className: '[&>:is(img,svg,video)]:object-cover' },
      {
        ...props,
        style
      }
    ),
    render,
    state: {}
  })
}
