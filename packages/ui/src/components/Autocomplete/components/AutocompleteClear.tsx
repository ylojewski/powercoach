import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { XIcon } from 'lucide-react'
import { use, type ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

import { autocompleteControlVariants } from '../constants/autocompleteControlVariants'
import { autocompleteInputGroupContext } from '../constants/autocompleteInputGroupContext'
import { autocompleteSizeContext } from '../constants/autocompleteSizeContext'
import { resolveAutocompleteClassName } from '../utils/resolveAutocompleteClassName'

export type AutocompleteClearProps = Omit<BaseUiAutocomplete.Clear.Props, 'children'>

export type AutocompleteClearState = BaseUiAutocomplete.Clear.State

export function AutocompleteClear(props: AutocompleteClearProps): ReactElement {
  const {
    children: _children,
    className,
    keepMounted,
    ...clearProps
  } = props as BaseUiAutocomplete.Clear.Props
  const insideInputGroup = use(autocompleteInputGroupContext)
  const size = use(autocompleteSizeContext)

  void _children

  return (
    <BaseUiAutocomplete.Clear
      {...clearProps}
      className={(state) => {
        const resolvedClassName = resolveAutocompleteClassName(
          className,
          state,
          insideInputGroup
            ? twMerge(
                autocompleteControlVariants({ size }),
                `opacity-100 transition-opacity duration-200 ease-linear [transition:opacity_200ms_linear] not-data-visible:pointer-events-none not-data-visible:opacity-0 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:duration-0`
              )
            : undefined
        )

        return insideInputGroup
          ? `transition-colors duration-300 ${resolvedClassName}`
          : resolvedClassName
      }}
      keepMounted={insideInputGroup ? (keepMounted ?? true) : keepMounted}
    >
      <XIcon aria-hidden="true" />
    </BaseUiAutocomplete.Clear>
  )
}
