import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { use, useRef, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { Text, type TextProps } from '../../Text'
import { autocompleteContentContext } from '../constants/autocompleteContentContext'
import { autocompletePopupContentVariants } from '../constants/autocompletePopupContentVariants'
import { autocompleteSizeContext } from '../constants/autocompleteSizeContext'
import { resolveAutocompleteClassName } from '../utils/resolveAutocompleteClassName'

export type AutocompleteEmptyProps = BaseUiAutocomplete.Empty.Props

export type AutocompleteEmptyState = BaseUiAutocomplete.Empty.State

export function AutocompleteEmpty({
  children,
  className,
  ...props
}: AutocompleteEmptyProps): ReactElement {
  const contentContext = use(autocompleteContentContext)
  const size = use(autocompleteSizeContext)
  const textSize = size === 'xl' ? 'md' : size === 'md' ? 'sm' : 'xs'
  const childrenRef = useRef(children)

  if (!contentContext?.closingSnapshotActive) {
    childrenRef.current = children
  }

  return (
    <Text
      render={(textProps) => (
        <BaseUiAutocomplete.Empty
          {...props}
          className={(state) =>
            resolveAutocompleteClassName(
              className,
              state,
              twMerge(
                textProps.className,
                `empty:m-0 empty:h-0 empty:min-h-0 empty:border-0 empty:p-0`,
                autocompletePopupContentVariants({
                  expandedStart: contentContext?.addOnPosition === 'start',
                  kind: 'row',
                  size
                })
              )
            )
          }
        >
          {contentContext?.closingSnapshotActive ? childrenRef.current : children}
        </BaseUiAutocomplete.Empty>
      )}
      size={textSize satisfies TextProps['size']}
      tone="muted"
    />
  )
}
