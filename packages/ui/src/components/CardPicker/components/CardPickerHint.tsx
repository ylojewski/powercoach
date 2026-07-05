import { useContext, type ContextType, type ReactElement } from 'react'

import { Hint, type HintProps } from '../../Hint'
import { cardPickerContext } from '../constants/cardPickerContext'

export type CardPickerHintProps = Omit<HintProps, 'hints' | 'waitingKey'>

export function CardPickerHint(props: CardPickerHintProps): ReactElement | null {
  const context = useContext(cardPickerContext) as NonNullable<
    ContextType<typeof cardPickerContext>
  >

  return (
    <Hint {...props} hints={context.hints} id={context.hintId} waitingKey={context.waitingKey} />
  )
}
