import { CardPickerCard } from './components/CardPickerCard'
import { CardPickerGroup } from './components/CardPickerGroup'
import { CardPickerHint } from './components/CardPickerHint'
import { CardPickerRoot } from './components/CardPickerRoot'

export * from './components/CardPickerCard'
export * from './components/CardPickerGroup'
export * from './components/CardPickerHint'
export * from './components/CardPickerRoot'
export * from './types/CardPickerTypes'

export interface CardPickerNamespace {
  Card: typeof CardPickerCard
  Group: typeof CardPickerGroup
  Hint: typeof CardPickerHint
  Root: typeof CardPickerRoot
}

export const CardPicker: CardPickerNamespace = {
  Card: CardPickerCard,
  Group: CardPickerGroup,
  Hint: CardPickerHint,
  Root: CardPickerRoot
}
