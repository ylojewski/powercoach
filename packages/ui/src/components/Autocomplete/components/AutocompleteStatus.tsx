import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { use, useRef, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { Text, type TextProps } from '../../Text'
import { autocompleteContentContext } from '../constants/autocompleteContentContext'
import { autocompletePopupContentVariants } from '../constants/autocompletePopupContentVariants'
import { autocompleteSizeContext } from '../constants/autocompleteSizeContext'
import { resolveAutocompleteClassName } from '../utils/resolveAutocompleteClassName'

export type AutocompleteStatusProps = BaseUiAutocomplete.Status.Props

export type AutocompleteStatusState = BaseUiAutocomplete.Status.State

export function AutocompleteStatus({
  children,
  className,
  ...props
}: AutocompleteStatusProps): ReactElement {
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
        <BaseUiAutocomplete.Status
          {...props}
          className={(state) =>
            resolveAutocompleteClassName(
              className,
              state,
              twMerge(
                textProps.className,
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
        </BaseUiAutocomplete.Status>
      )}
      size={textSize satisfies TextProps['size']}
      tone="muted"
    />
  )
}
