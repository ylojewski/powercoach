import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { useLayoutEffect, type MutableRefObject, type ReactElement } from 'react'

export interface AutocompleteSnapshotObserverProps {
  filteredItemsRef: MutableRefObject<unknown[]>
}

export function AutocompleteSnapshotObserver({
  filteredItemsRef
}: AutocompleteSnapshotObserverProps): ReactElement | null {
  const filteredItems = BaseUiAutocomplete.useFilteredItems<unknown>()

  useLayoutEffect(() => {
    filteredItemsRef.current = filteredItems
  }, [filteredItems, filteredItemsRef])

  return null
}
