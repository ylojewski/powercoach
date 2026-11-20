import { RadioGroup as BaseUiRadioGroup } from '@base-ui/react/radio-group'
import { type ReactElement } from 'react'

export type CardGroupProps<TValue> = BaseUiRadioGroup.Props<TValue>

export type CardGroupState = BaseUiRadioGroup.State

export type CardGroupChangeEventReason = BaseUiRadioGroup.ChangeEventReason

export type CardGroupChangeEventDetails = BaseUiRadioGroup.ChangeEventDetails

export function CardGroup<TValue>(props: CardGroupProps<TValue>): ReactElement {
  return <BaseUiRadioGroup {...props} />
}
