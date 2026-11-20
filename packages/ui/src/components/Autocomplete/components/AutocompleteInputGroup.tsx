import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { use, type ReactElement } from 'react'

import { autocompleteContentContext } from '../constants/autocompleteContentContext'
import { autocompleteInputGroupContext } from '../constants/autocompleteInputGroupContext'
import { autocompleteInputGroupVariants } from '../constants/autocompleteInputGroupVariants'
import { autocompleteSizeContext } from '../constants/autocompleteSizeContext'
import { useAutocompleteMergedRefs } from '../hooks/useAutocompleteMergedRefs'
import { resolveAutocompleteClassName } from '../utils/resolveAutocompleteClassName'

export type AutocompleteInputGroupProps = BaseUiAutocomplete.InputGroup.Props

export type AutocompleteInputGroupState = BaseUiAutocomplete.InputGroup.State

export function AutocompleteInputGroup({
  children,
  className,
  ref,
  ...props
}: AutocompleteInputGroupProps): ReactElement {
  const contentContext = use(autocompleteContentContext)
  const size = use(autocompleteSizeContext)
  const inputGroupElementRef = contentContext?.inputGroupElementRef
  const composedRef = useAutocompleteMergedRefs(inputGroupElementRef, ref)

  return (
    <BaseUiAutocomplete.InputGroup
      {...props}
      className={(state) =>
        resolveAutocompleteClassName(className, state, autocompleteInputGroupVariants({ size }))
      }
      data-size={size}
      ref={composedRef}
    >
      <autocompleteInputGroupContext.Provider value>
        {children}
      </autocompleteInputGroupContext.Provider>
    </BaseUiAutocomplete.InputGroup>
  )
}
