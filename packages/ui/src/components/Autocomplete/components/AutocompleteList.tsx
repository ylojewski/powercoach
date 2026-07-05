import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { use, type ReactElement, type ReactNode } from 'react'

import { AutocompleteAutomaticCollection } from './AutocompleteAutomaticCollection'
import { autocompleteContentContext } from '../constants/autocompleteContentContext'
import { resolveAutocompleteClassName } from '../utils/resolveAutocompleteClassName'

type AutocompleteListCommonProps = Omit<BaseUiAutocomplete.List.Props, 'children'>

interface AutocompleteListAutomaticProps {
  children?: undefined
}

interface AutocompleteListCallbackProps {
  // The exact callback value is inferred by Base UI from Root items at the call site.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (item: any, index: number) => ReactNode
}

interface AutocompleteListNodeProps {
  children: Exclude<ReactNode, undefined>
}

export type AutocompleteListProps = AutocompleteListCommonProps &
  (AutocompleteListAutomaticProps | AutocompleteListCallbackProps | AutocompleteListNodeProps)

export type AutocompleteListState = BaseUiAutocomplete.List.State

export function AutocompleteList({
  children,
  className,
  ...props
}: AutocompleteListProps): ReactElement {
  const contentContext = use(autocompleteContentContext)
  const filteredItems = BaseUiAutocomplete.useFilteredItems<unknown>()
  const resolvedCollection =
    typeof children === 'function' ? (
      <BaseUiAutocomplete.Collection>{children}</BaseUiAutocomplete.Collection>
    ) : children !== undefined ? (
      children
    ) : contentContext?.grid || contentContext?.virtualized ? null : (
      <AutocompleteAutomaticCollection allowGroups items={filteredItems} />
    )

  return (
    <BaseUiAutocomplete.List
      {...props}
      className={(state) => resolveAutocompleteClassName(className, state, 'relative px-0')}
    >
      {resolvedCollection}
    </BaseUiAutocomplete.List>
  )
}
