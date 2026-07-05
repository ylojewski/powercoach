import { Input as BaseUiInput } from '@base-ui/react/input'
import { mergeProps } from '@base-ui/react/merge-props'
import { use, type ReactElement, type RefAttributes } from 'react'

import { inputControlVariants } from '../constants/inputControlVariants'
import { inputSizeContext } from '../constants/inputSizeContext'

export interface InputControlProps extends BaseUiInput.Props {}

export type InputControlState = BaseUiInput.State

export type InputControlChangeEventReason = BaseUiInput.ChangeEventReason

export type InputControlChangeEventDetails = BaseUiInput.ChangeEventDetails

export function InputControl(
  props: Omit<InputControlProps, 'ref'> & RefAttributes<HTMLElement>
): ReactElement

export function InputControl({
  className,
  ...props
}: Omit<InputControlProps, 'ref'> & RefAttributes<HTMLElement>): ReactElement {
  const size = use(inputSizeContext)

  return (
    <BaseUiInput
      {...props}
      className={(state) =>
        mergeProps<'input'>(
          {
            className: inputControlVariants({ size })
          },
          {
            className: typeof className === 'function' ? className(state) : className
          }
        ).className
      }
    />
  )
}
