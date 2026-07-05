import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { type ReactElement } from 'react'

export type AutocompleteArrowProps = BaseUiAutocomplete.Arrow.Props

export type AutocompleteArrowState = BaseUiAutocomplete.Arrow.State

export function AutocompleteArrow(props: AutocompleteArrowProps): ReactElement {
  return <BaseUiAutocomplete.Arrow {...props} />
}
