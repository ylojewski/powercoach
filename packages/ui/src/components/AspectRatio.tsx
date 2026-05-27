import { type ComponentProps, type CSSProperties, type ReactElement } from 'react'

import { cn } from '../coss'

export interface AspectRatioProps extends ComponentProps<'div'> {
  ratio: number
}

function AspectRatio({ ratio, className, style, ...props }: AspectRatioProps): ReactElement {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ '--ratio': ratio, ...style } as CSSProperties}
      className={cn(
        'relative aspect-(--ratio) overflow-hidden',
        '[&>img,video]:h-full [&>img,video]:w-full [&>img,video]:object-cover',
        className
      )}
      {...props}
    />
  )
}

export { AspectRatio }
