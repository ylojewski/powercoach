import { mergeProps } from '@base-ui/react/merge-props'
import { type ComponentPropsWithRef, type ReactElement } from 'react'

import { cardVariants } from '../constants/cardVariants'
import { useCardContext } from '../hooks/useCardContext'

export type CardHeaderProps = ComponentPropsWithRef<'div'>

export function CardHeader({ className, ...props }: CardHeaderProps): ReactElement {
  const { size } = useCardContext()

  return (
    <div
      {...mergeProps<'div'>(
        {
          className: cardVariants.header({ size })
        },
        { className },
        props
      )}
    />
  )
}
