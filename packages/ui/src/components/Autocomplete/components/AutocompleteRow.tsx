import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { type ReactElement } from 'react'

export type AutocompleteRowProps = BaseUiAutocomplete.Row.Props

export type AutocompleteRowState = BaseUiAutocomplete.Row.State

export function AutocompleteRow(props: AutocompleteRowProps): ReactElement {
  return <BaseUiAutocomplete.Row {...props} />
}
