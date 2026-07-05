import { type ReactElement } from 'react'

import { Text, type TextProps } from '../../Text'
import { CARD_SIZE_MAPPINGS } from '../constants/cardSizeMappings'
import { useCardContext } from '../hooks/useCardContext'

export type CardDescriptionProps = TextProps

export function CardDescription({
  size,
  tone = 'muted',
  ...props
}: CardDescriptionProps): ReactElement {
  const { size: cardSize } = useCardContext()
  const textProps = {
    ...props,
    size: size ?? CARD_SIZE_MAPPINGS.description[cardSize],
    tone
  } as CardDescriptionProps

  return <Text {...textProps} />
}
