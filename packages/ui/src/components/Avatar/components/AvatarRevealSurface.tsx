import { mergeProps } from '@base-ui/react/merge-props'
import { type ComponentPropsWithRef, type ReactElement, type ReactNode } from 'react'

export interface AvatarRevealSurfaceProps extends ComponentPropsWithRef<'span'> {
  realChildren: ReactNode
}

export function AvatarRevealSurface({
  children,
  className,
  realChildren,
  ...props
}: AvatarRevealSurfaceProps): ReactElement {
  const isOverlaySurface = 'data-reveal-overlay-surface' in props

  return (
    <span
      {...mergeProps<'span'>(
        {
          className: isOverlaySurface
            ? `
              relative flex size-full items-center justify-center
              border border-transparent bg-background text-foreground
            `
            : 'relative flex size-full items-center justify-center'
        },
        { className },
        props
      )}
    >
      {isOverlaySurface ? children : realChildren}
    </span>
  )
}
