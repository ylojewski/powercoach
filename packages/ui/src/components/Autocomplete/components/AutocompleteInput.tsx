import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { use, type ReactElement } from 'react'

import { autocompleteContentContext } from '../constants/autocompleteContentContext'
import { autocompleteInputGroupContext } from '../constants/autocompleteInputGroupContext'
import { autocompleteInputVariants } from '../constants/autocompleteInputVariants'
import { autocompleteSizeContext } from '../constants/autocompleteSizeContext'
import { useAutocompleteMergedRefs } from '../hooks/useAutocompleteMergedRefs'
import { resolveAutocompleteClassName } from '../utils/resolveAutocompleteClassName'

export type AutocompleteInputProps = BaseUiAutocomplete.Input.Props

export type AutocompleteInputState = BaseUiAutocomplete.Input.State

export function AutocompleteInput({
  className,
  ref,
  ...props
}: AutocompleteInputProps): ReactElement {
  const contentContext = use(autocompleteContentContext)
  const insideInputGroup = use(autocompleteInputGroupContext)
  const size = use(autocompleteSizeContext)
  const inputElementRef = contentContext?.inputElementRef
  const composedRef = useAutocompleteMergedRefs(inputElementRef, ref)

  return (
    <BaseUiAutocomplete.Input
      {...props}
      className={(state) =>
        resolveAutocompleteClassName(
          className,
          state,
          insideInputGroup ? autocompleteInputVariants({ size }) : undefined
        )
      }
      ref={composedRef}
    />
  )
}
