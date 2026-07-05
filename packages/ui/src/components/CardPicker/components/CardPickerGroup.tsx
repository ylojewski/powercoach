import { useContext, type ContextType, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { Card, type CardGroupProps, type CardGroupState } from '../../Card'
import { cardPickerContext } from '../constants/cardPickerContext'
import { type CardPickerValue } from '../types/CardPickerTypes'
import { resolveCardPickerClassName } from '../utils/resolveCardPickerClassName'

export type CardPickerGroupProps = Omit<
  CardGroupProps<CardPickerValue>,
  | 'defaultValue'
  | 'disabled'
  | 'form'
  | 'inputRef'
  | 'name'
  | 'onValueChange'
  | 'readOnly'
  | 'required'
  | 'value'
>

export type CardPickerGroupState = CardGroupState

export function CardPickerGroup({
  'aria-describedby': ariaDescribedBy,
  className,
  ...props
}: CardPickerGroupProps): ReactElement {
  const context = useContext(cardPickerContext) as NonNullable<
    ContextType<typeof cardPickerContext>
  >
  const axisClassName = context.placement.startsWith('block-') ? 'flex flex-col' : 'flex flex-row'
  const describedBy = `${ariaDescribedBy ?? ''} ${context.hintId}`.trim()

  return (
    <Card.Group
      {...props}
      aria-describedby={describedBy}
      className={(state) =>
        twMerge(axisClassName, 'gap-3', resolveCardPickerClassName(className, state))
      }
      disabled={context.disabled}
      form={context.form}
      inputRef={context.inputRef}
      name={context.name}
      onValueChange={context.onValueChange}
      readOnly={context.readOnly}
      required={context.required}
      value={context.value as CardPickerValue}
    />
  )
}
