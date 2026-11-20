import { type ReactElement } from 'react'

import { Heading, type HeadingProps } from '../../Heading'
import { CARD_SIZE_MAPPINGS } from '../constants/cardSizeMappings'
import { useCardContext } from '../hooks/useCardContext'

export type CardTitleProps = HeadingProps

export function CardTitle({ size, ...props }: CardTitleProps): ReactElement {
  const { size: cardSize } = useCardContext()

  return <Heading {...props} size={size ?? CARD_SIZE_MAPPINGS.title[cardSize]} />
}
