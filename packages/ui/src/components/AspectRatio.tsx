import { type ComponentProps, type CSSProperties, type ReactElement } from 'react'

import { cn } from '../coss'

export interface AspectRatioProps extends ComponentProps<'div'> {
  fit?: 'contain' | 'cover'
  ratio: number
}

function AspectRatio({
  ratio,
  className,
  fit = 'cover',
  style,
  ...props
}: AspectRatioProps): ReactElement {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ '--ratio': ratio, ...style } as CSSProperties}
      className={cn(
        'relative aspect-(--ratio) overflow-hidden',
        '[&>:is(img,svg,video)]:size-full',
        fit === 'contain' && '[&>:is(img,svg,video)]:object-contain',
        fit === 'cover' && '[&>:is(img,svg,video)]:object-cover',
        className
      )}
      {...props}
    />
  )
}

export { AspectRatio }
