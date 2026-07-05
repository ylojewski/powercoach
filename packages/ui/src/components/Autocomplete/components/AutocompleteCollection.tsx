import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { use, type ReactElement } from 'react'

import { AutocompleteAutomaticCollection } from './AutocompleteAutomaticCollection'
import { autocompleteContentContext } from '../constants/autocompleteContentContext'
import { autocompleteGroupItemsContext } from '../constants/autocompleteGroupItemsContext'

export type AutocompleteCollectionProps = Omit<BaseUiAutocomplete.Collection.Props, 'children'> & {
  children?: BaseUiAutocomplete.Collection.Props['children']
}

export type AutocompleteCollectionState = BaseUiAutocomplete.Collection.State

export function AutocompleteCollection({ children }: AutocompleteCollectionProps): ReactElement {
  const contentContext = use(autocompleteContentContext)
  const groupItems = use(autocompleteGroupItemsContext)

  if (children !== undefined) {
    return <BaseUiAutocomplete.Collection>{children}</BaseUiAutocomplete.Collection>
  }

  if (contentContext?.grid || contentContext?.virtualized || groupItems === undefined) {
    return <></>
  }

  return <AutocompleteAutomaticCollection allowGroups={false} items={groupItems} />
}
