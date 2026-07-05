import {
  use,
  useEffect,
  useImperativeHandle,
  useRef,
  type ReactElement,
  type RefAttributes
} from 'react'

import {
  Input,
  type InputAddOnProps,
  type InputControlChangeEventDetails,
  type InputControlChangeEventReason,
  type InputControlProps,
  type InputControlState,
  type InputRootProps
} from '../../Input'
import { fieldRequiredContext } from '../constants/fieldRequiredContext'

export type FieldControlState = InputControlState

export type FieldControlChangeEventReason = InputControlChangeEventReason

export type FieldControlChangeEventDetails = InputControlChangeEventDetails

type FieldControlDataAttributes = Partial<Record<`data-${string}`, string | number | boolean>>

export type FieldControlInputRootProps = Omit<InputRootProps, 'children'>

export type FieldControlInputAddOnProps = Omit<InputAddOnProps, 'children'>

export type FieldControlProps = Omit<InputControlProps, 'children' | 'ref' | 'required'> &
  RefAttributes<HTMLElement> & {
    addOn: ReactElement
    inputAddOnProps?: FieldControlInputAddOnProps & FieldControlDataAttributes
    inputRootProps?: FieldControlInputRootProps & FieldControlDataAttributes
    required?: never
  }

export function FieldControl({
  addOn,
  children: _children,
  inputAddOnProps,
  inputRootProps,
  ref,
  required: _required,
  ...props
}: FieldControlProps & { children?: unknown; required?: unknown }): ReactElement {
  const fieldContext = use(fieldRequiredContext)
  const fallbackControlRef = useRef<HTMLElement | null>(null)
  const controlRef = fieldContext.controlRef ?? fallbackControlRef
  const required = fieldContext.required

  useImperativeHandle(ref, () => controlRef.current as HTMLElement)

  useEffect(() => {
    const control = controlRef.current as HTMLElement

    const invalidateValidationOwnership = fieldContext.invalidateValidationOwnership
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        invalidateValidationOwnership()
      }
    }
    const form = control.closest('form')

    control.addEventListener('blur', invalidateValidationOwnership)
    control.addEventListener('change', invalidateValidationOwnership)
    control.addEventListener('input', invalidateValidationOwnership)
    control.addEventListener('keydown', handleKeyDown)
    form?.addEventListener('submit', invalidateValidationOwnership)

    return () => {
      control.removeEventListener('blur', invalidateValidationOwnership)
      control.removeEventListener('change', invalidateValidationOwnership)
      control.removeEventListener('input', invalidateValidationOwnership)
      control.removeEventListener('keydown', handleKeyDown)
      form?.removeEventListener('submit', invalidateValidationOwnership)
    }
  })

  const resolvedInputRootProps = { ...(inputRootProps ?? {}) } as FieldControlInputRootProps & {
    children?: unknown
    render?: unknown
  }
  const resolvedInputAddOnProps = { ...(inputAddOnProps ?? {}) } as FieldControlInputAddOnProps & {
    children?: unknown
  }
  const onInputRootClick = resolvedInputRootProps.onClick

  delete resolvedInputRootProps.children
  delete resolvedInputRootProps.onClick
  delete resolvedInputRootProps.render
  delete resolvedInputAddOnProps.children

  return (
    <Input.Root
      {...resolvedInputRootProps}
      onClick={
        onInputRootClick === undefined
          ? undefined
          : (event) => {
              if ((event.target as Element).closest('[data-field-addon]') !== null) {
                return
              }

              onInputRootClick(event)
            }
      }
    >
      <Input.AddOn {...resolvedInputAddOnProps}>{addOn}</Input.AddOn>
      <Input.Control {...props} ref={controlRef} required={required} />
    </Input.Root>
  )
}
