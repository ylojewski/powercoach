import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { type ReactElement } from 'react'

export type AutocompleteValueProps = BaseUiAutocomplete.Value.Props

export type AutocompleteValueState = BaseUiAutocomplete.Value.State

export function AutocompleteValue(props: AutocompleteValueProps): ReactElement {
  return <BaseUiAutocomplete.Value {...props} />
}
