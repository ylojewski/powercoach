import { mergeProps } from '@base-ui/react/merge-props'
import { type ComponentPropsWithRef, type ReactElement, type ReactNode } from 'react'

import { Stripes } from '../../Stripes'
import { cardVariants } from '../constants/cardVariants'
import { useCardContext } from '../hooks/useCardContext'
import { type CardVisualPlacement, type CardVisualStripesProps } from '../types/CardTypes'

export interface CardVisualProps extends ComponentPropsWithRef<'div'> {
  icon?: ReactNode
  placement?: CardVisualPlacement
  stripesProps?: boolean | CardVisualStripesProps
}

export function CardVisual({
  children,
  className,
  icon,
  placement = 'flow',
  stripesProps = true,
  ...props
}: CardVisualProps): ReactElement {
  const { size } = useCardContext()
  const configuredStripesProps = typeof stripesProps === 'object' ? stripesProps : undefined
  const untypedStripesProps = { ...configuredStripesProps } as CardVisualStripesProps & {
    children?: unknown
    render?: unknown
  }
  delete untypedStripesProps.children
  delete untypedStripesProps.render
  const supportedStripesProps = untypedStripesProps as CardVisualStripesProps

  return (
    <div
      {...mergeProps<'div'>(
        {
          className: cardVariants.visual({ placement, size })
        },
        { className },
        props
      )}
    >
      {stripesProps === false ? null : (
        <Stripes
          {...supportedStripesProps}
          aria-hidden="true"
          className={
            mergeProps<'div'>(
              {
                className: 'pointer-events-none absolute inset-0 -z-10'
              },
              {
                className: supportedStripesProps.className
              }
            ).className
          }
        />
      )}
      {icon === undefined ? null : <div className={cardVariants.icon({ size })}>{icon}</div>}
      {children}
    </div>
  )
}
