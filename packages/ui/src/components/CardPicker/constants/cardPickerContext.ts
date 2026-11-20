import { createContext, type Key, type Ref } from 'react'

import { type CardGroupChangeEventDetails } from '../../Card'
import { type HintItem } from '../../Hint'
import { type CardPickerPlacement, type CardPickerValue } from '../types/CardPickerTypes'

export interface CardPickerContextValue {
  disabled: boolean
  form: string | undefined
  hintId: string
  hints: readonly HintItem[]
  inputRef: Ref<HTMLInputElement> | undefined
  name: string | undefined
  onValueChange: (value: CardPickerValue, eventDetails: CardGroupChangeEventDetails) => void
  placement: CardPickerPlacement
  readOnly: boolean
  required: boolean
  value: CardPickerValue | null
  waitingKey: Key
}

export const cardPickerContext = createContext<CardPickerContextValue | undefined>(undefined)
