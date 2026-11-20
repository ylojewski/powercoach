import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { use, type ReactElement } from 'react'

import { autocompleteContentContext } from '../constants/autocompleteContentContext'
import { autocompleteControlVariants } from '../constants/autocompleteControlVariants'
import { autocompleteInputGroupContext } from '../constants/autocompleteInputGroupContext'
import { autocompleteSizeContext } from '../constants/autocompleteSizeContext'
import { useAutocompleteMergedRefs } from '../hooks/useAutocompleteMergedRefs'
import { resolveAutocompleteClassName } from '../utils/resolveAutocompleteClassName'

export type AutocompleteTriggerProps = BaseUiAutocomplete.Trigger.Props

export type AutocompleteTriggerState = BaseUiAutocomplete.Trigger.State

export function AutocompleteTrigger({
  className,
  ref,
  ...props
}: AutocompleteTriggerProps): ReactElement {
  const contentContext = use(autocompleteContentContext)
  const insideInputGroup = use(autocompleteInputGroupContext)
  const size = use(autocompleteSizeContext)
  const triggerElementRef = contentContext?.triggerElementRef
  const composedRef = useAutocompleteMergedRefs(triggerElementRef, ref)

  return (
    <BaseUiAutocomplete.Trigger
      {...props}
      className={(state) =>
        resolveAutocompleteClassName(
          className,
          state,
          insideInputGroup ? autocompleteControlVariants({ size }) : undefined
        )
      }
      ref={composedRef}
    />
  )
}
