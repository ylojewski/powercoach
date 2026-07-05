import { mergeProps } from '@base-ui/react/merge-props'
import { type ComponentPropsWithRef, type ReactElement } from 'react'

import { cardVariants } from '../constants/cardVariants'
import { useCardContext } from '../hooks/useCardContext'

export type CardFooterProps = ComponentPropsWithRef<'div'>

export function CardFooter({ className, ...props }: CardFooterProps): ReactElement {
  const { size } = useCardContext()

  return (
    <div
      {...mergeProps<'div'>(
        {
          className: cardVariants.footer({ size })
        },
        { className },
        props
      )}
    />
  )
}
