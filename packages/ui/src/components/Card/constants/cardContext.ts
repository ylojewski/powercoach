import { createContext } from 'react'

import { type CardSize } from '../types/CardTypes'

export interface CardSelectorMirrorState {
  checked: boolean
  disabled: boolean
  readOnly: boolean
}

export interface CardContextValue {
  disabled: boolean
  onSelectorStateChange: (state: CardSelectorMirrorState) => void
  onSelectorUnmount: () => void
  readOnly: boolean
  selectable: boolean
  selected: boolean
  size: CardSize
}

export const cardContext = createContext<CardContextValue>({
  disabled: false,
  onSelectorStateChange: Function.prototype as CardContextValue['onSelectorStateChange'],
  onSelectorUnmount: Function.prototype as CardContextValue['onSelectorUnmount'],
  readOnly: false,
  selectable: false,
  selected: false,
  size: 'md'
})
