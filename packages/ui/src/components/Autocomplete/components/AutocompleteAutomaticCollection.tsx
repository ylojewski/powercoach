import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { use, useLayoutEffect, useState, type ReactElement } from 'react'

import { AutocompleteGroup } from './AutocompleteGroup'
import { AutocompleteGroupLabel } from './AutocompleteGroupLabel'
import { AutocompleteItem } from './AutocompleteItem'
import { autocompleteContentContext } from '../constants/autocompleteContentContext'
import {
  type AutocompleteGroupOption,
  type AutocompleteItemOption
} from '../types/AutocompleteTypes'
import { resolveAutocompleteAutomaticPresentation } from '../utils/resolveAutocompleteAutomaticPresentation'

// Base UI initializes the non-virtualized list registry after indexed Items attach.
// Switching a harmless forwarded ref republishes those same indexed elements without delaying SSR.
const pendingListRegistryRef = () => undefined
const readyListRegistryRef = () => undefined

export interface AutocompleteAutomaticCollectionProps {
  allowGroups: boolean
  items: readonly unknown[]
}

export function AutocompleteAutomaticCollection({
  allowGroups,
  items
}: AutocompleteAutomaticCollectionProps): ReactElement | null {
  const contentContext = use(autocompleteContentContext)
  const [listRegistryReady, setListRegistryReady] = useState(false)
  const presentation = resolveAutocompleteAutomaticPresentation(items)

  useLayoutEffect(() => {
    setListRegistryReady(true)
  }, [])

  if (presentation === null || (presentation === 'grouped' && !allowGroups)) {
    return null
  }

  if (presentation === 'grouped') {
    return (
      <>
        {(items as readonly AutocompleteGroupOption[]).map((group) => (
          <AutocompleteGroup
            items={group.items as unknown[]}
            key={contentContext?.getObjectKey(group)}
          >
            <AutocompleteGroupLabel icon={group.icon}>{group.text}</AutocompleteGroupLabel>
            <BaseUiAutocomplete.Collection>
              {(item: AutocompleteItemOption) => (
                <AutocompleteItem
                  icon={item.icon}
                  key={contentContext?.getObjectKey(item)}
                  onClick={(event) =>
                    contentContext?.recordAutomaticItemPress(item, event.nativeEvent)
                  }
                  value={item}
                >
                  {item.text}
                </AutocompleteItem>
              )}
            </BaseUiAutocomplete.Collection>
          </AutocompleteGroup>
        ))}
      </>
    )
  }

  return (
    <BaseUiAutocomplete.Collection>
      {(item: AutocompleteItemOption, index: number) => (
        <AutocompleteItem
          icon={item.icon}
          index={index}
          key={contentContext?.getObjectKey(item)}
          onClick={(event) => contentContext?.recordAutomaticItemPress(item, event.nativeEvent)}
          ref={listRegistryReady ? readyListRegistryRef : pendingListRegistryRef}
          value={item}
        >
          {item.text}
        </AutocompleteItem>
      )}
    </BaseUiAutocomplete.Collection>
  )
}
