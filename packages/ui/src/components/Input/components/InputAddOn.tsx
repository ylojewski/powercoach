import { mergeProps } from '@base-ui/react/merge-props'
import { use, type ComponentPropsWithRef, type CSSProperties, type ReactElement } from 'react'

import { inputAddOnVariants } from '../constants/inputAddOnVariants'
import { inputSizeContext } from '../constants/inputSizeContext'
import { type InputAddOnPosition } from '../types/InputTypes'

type InputAddOnAriaProp = Extract<keyof ComponentPropsWithRef<'span'>, `aria-${string}`>
type InputAddOnEventProp = Extract<keyof ComponentPropsWithRef<'span'>, `on${string}`>
type InputAddOnInteractiveProp =
  | 'accessKey'
  | 'autoFocus'
  | 'contentEditable'
  | 'contextMenu'
  | 'dangerouslySetInnerHTML'
  | 'draggable'
  | 'inert'
  | 'popover'
  | 'popoverTarget'
  | 'popoverTargetAction'
  | 'role'
  | 'suppressContentEditableWarning'
  | 'tabIndex'
  | 'title'

export type InputAddOnProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'style' | InputAddOnAriaProp | InputAddOnEventProp | InputAddOnInteractiveProp
> & {
  children: ReactElement
  position?: InputAddOnPosition
  style?: Omit<CSSProperties, 'pointerEvents'>
}

export function InputAddOn({
  children,
  className,
  position = 'start',
  ref,
  style,
  ...props
}: InputAddOnProps): ReactElement {
  const size = use(inputSizeContext)
  const passiveProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => {
      if (key.startsWith('aria-') || key.startsWith('on')) {
        return false
      }

      switch (key) {
        case 'accessKey':
        case 'autoFocus':
        case 'contentEditable':
        case 'contextMenu':
        case 'dangerouslySetInnerHTML':
        case 'draggable':
        case 'inert':
        case 'popover':
        case 'popoverTarget':
        case 'popoverTargetAction':
        case 'role':
        case 'suppressContentEditableWarning':
        case 'tabIndex':
        case 'title':
          return false
        default:
          return true
      }
    })
  ) as ComponentPropsWithRef<'span'>

  return (
    <span
      {...mergeProps<'span'>(
        passiveProps,
        {
          className,
          style
        },
        {
          'aria-hidden': true,
          className: inputAddOnVariants({ position, size }),
          inert: true,
          style: { pointerEvents: 'none' }
        }
      )}
      data-field-addon=""
      data-position={position}
      ref={ref}
    >
      {children}
    </span>
  )
}
