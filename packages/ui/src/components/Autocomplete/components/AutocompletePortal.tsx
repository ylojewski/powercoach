import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { type ReactElement } from 'react'

export type AutocompletePortalProps = BaseUiAutocomplete.Portal.Props

export type AutocompletePortalState = BaseUiAutocomplete.Portal.State

export function AutocompletePortal(props: AutocompletePortalProps): ReactElement {
  return <BaseUiAutocomplete.Portal {...props} />
}
