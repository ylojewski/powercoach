import { mergeProps } from '@base-ui/react/merge-props'
import { type ComponentPropsWithRef, type ReactElement } from 'react'

import { cardVariants } from '../constants/cardVariants'
import { useCardContext } from '../hooks/useCardContext'

export type CardContentProps = ComponentPropsWithRef<'div'>

export function CardContent({ className, ...props }: CardContentProps): ReactElement {
  const { size } = useCardContext()

  return (
    <div
      {...mergeProps<'div'>(
        {
          className: cardVariants.content({ size })
        },
        { className },
        props
      )}
    />
  )
}
