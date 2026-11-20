import { type ReactElement } from 'react'

import { Button, type ButtonProps } from '../../Button'
import { CARD_SIZE_MAPPINGS } from '../constants/cardSizeMappings'
import { useCardContext } from '../hooks/useCardContext'

export type CardButtonProps = Omit<ButtonProps, 'size'>

export function CardButton(props: CardButtonProps): ReactElement {
  const { size } = useCardContext()

  return <Button {...props} size={CARD_SIZE_MAPPINGS.button[size]} />
}
