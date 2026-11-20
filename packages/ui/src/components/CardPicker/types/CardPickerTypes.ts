import { type Key } from 'react'

import { type CardSelectorProps } from '../../Card'
import { type HintItem } from '../../Hint'

export type CardPickerValue = Key

export type CardPickerPlacement = 'block-start' | 'block-end' | 'inline-start' | 'inline-end'

export type CardPickerCardHint = Omit<HintItem, 'condition' | 'key'>

export type CardPickerSelectorProps<TValue extends CardPickerValue = string> = Omit<
  CardSelectorProps<TValue>,
  'value'
>
