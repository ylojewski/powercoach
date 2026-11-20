import { Autocomplete as BaseUiAutocomplete } from '@base-ui/react/autocomplete'
import { createElement, useCallback, useMemo, useRef, useState, type ReactElement } from 'react'

import { AutocompleteSnapshotObserver } from './AutocompleteSnapshotObserver'
import { autocompleteContentContext } from '../constants/autocompleteContentContext'
import { autocompleteSizeContext } from '../constants/autocompleteSizeContext'
import {
  type AutocompleteGroupOption,
  type AutocompleteItemOption,
  type AutocompleteSize
} from '../types/AutocompleteTypes'
import { resolveAutocompleteAutomaticPresentation } from '../utils/resolveAutocompleteAutomaticPresentation'

export type AutocompleteRootProps<ItemValue> = BaseUiAutocomplete.Root.Props<ItemValue> & {
  size?: AutocompleteSize
}

export type AutocompleteRootState = BaseUiAutocomplete.Root.State

export type AutocompleteRootActions = BaseUiAutocomplete.Root.Actions

export type AutocompleteRootChangeEventReason = BaseUiAutocomplete.Root.ChangeEventReason

export type AutocompleteRootChangeEventDetails = BaseUiAutocomplete.Root.ChangeEventDetails

export type AutocompleteRootHighlightEventReason = BaseUiAutocomplete.Root.HighlightEventReason

export type AutocompleteRootHighlightEventDetails = BaseUiAutocomplete.Root.HighlightEventDetails

export function AutocompleteRoot<
  ItemValue extends AutocompleteItemOption,
  GroupValue extends AutocompleteGroupOption<ItemValue>,
  Items extends readonly GroupValue[]
>(
  props: Omit<AutocompleteRootProps<ItemValue>, 'items'> & {
    items: Items
  }
): ReactElement

export function AutocompleteRoot<
  ItemValue extends AutocompleteItemOption,
  Items extends readonly ItemValue[]
>(
  props: Omit<AutocompleteRootProps<ItemValue>, 'items'> & {
    items: Items
  }
): ReactElement

export function AutocompleteRoot<
  Items extends readonly {
    items: readonly unknown[]
  }[]
>(
  props: Omit<AutocompleteRootProps<Items[number]['items'][number]>, 'items'> & {
    items: Items
  }
): ReactElement

export function AutocompleteRoot<ItemValue>(
  props: Omit<AutocompleteRootProps<ItemValue>, 'items'> & {
    items?: readonly ItemValue[]
  }
): ReactElement

export function AutocompleteRoot<ItemValue>({
  children,
  defaultOpen,
  defaultValue,
  filteredItems,
  grid = false,
  inline = false,
  itemToStringValue,
  items,
  onOpenChange,
  onOpenChangeComplete,
  onValueChange,
  open,
  size = 'xl',
  value,
  virtualized = false,
  ...props
}: AutocompleteRootProps<ItemValue>): ReactElement {
  const [addOnPosition, setAddOnPosition] = useState<'start' | 'end' | null>(null)
  const [closingSnapshotItems, setClosingSnapshotItems] = useState<unknown[] | null>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false)
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue === undefined ? '' : String(defaultValue)
  )
  const automaticInlineValueControlRef = useRef(false)
  const filteredItemsRef = useRef<unknown[]>(filteredItems === undefined ? [] : [...filteredItems])
  const inputElementRef = useRef<HTMLInputElement | null>(null)
  const inputGroupElementRef = useRef<HTMLDivElement | null>(null)
  const objectKeysRef = useRef(new WeakMap<object, number>())
  const objectKeyCountRef = useRef(0)
  const pendingAutomaticItemRef = useRef<unknown>(undefined)
  const pendingSnapshotRef = useRef<{ event: Event; items: unknown[] } | null>(null)
  const triggerElementRef = useRef<HTMLButtonElement | null>(null)
  const currentOpen = open ?? uncontrolledOpen
  const currentValue = value === undefined ? uncontrolledValue : String(value)
  const activeClosingSnapshotItems = currentOpen ? null : closingSnapshotItems
  const configuredAutomaticPresentation = resolveAutocompleteAutomaticPresentation(items)
  const automaticPresentation = resolveAutocompleteAutomaticPresentation(
    activeClosingSnapshotItems ?? filteredItems ?? items
  )
  const supportsAutomaticPresentation =
    configuredAutomaticPresentation !== null || automaticPresentation !== null
  const resolvedItemToStringValue =
    itemToStringValue ??
    (supportsAutomaticPresentation
      ? (item: ItemValue) => String(Reflect.get(item as object, 'text'))
      : undefined)
  if (inline && supportsAutomaticPresentation) {
    automaticInlineValueControlRef.current = true
  }
  const controlsAutomaticInlineValue =
    inline && automaticInlineValueControlRef.current && value === undefined
  const getObjectKey = useCallback((objectValue: object) => {
    const existingKey = objectKeysRef.current.get(objectValue)

    if (existingKey !== undefined) {
      return existingKey
    }

    const nextKey = objectKeyCountRef.current

    objectKeyCountRef.current += 1
    objectKeysRef.current.set(objectValue, nextKey)

    return nextKey
  }, [])
  const handleValueChange = useCallback(
    (nextValue: string, details: BaseUiAutocomplete.Root.ChangeEventDetails) => {
      if (details.reason === 'item-press') {
        pendingAutomaticItemRef.current = undefined
      }

      onValueChange?.(nextValue, details)

      if (details.isCanceled) {
        pendingSnapshotRef.current = null
        return
      }

      pendingSnapshotRef.current = null
      setUncontrolledValue(nextValue)

      if (
        details.reason === 'input-change' &&
        currentOpen &&
        currentValue !== '' &&
        nextValue === ''
      ) {
        pendingSnapshotRef.current = {
          event: details.event,
          items: [...filteredItemsRef.current]
        }
      }
    },
    [currentOpen, currentValue, onValueChange]
  )
  const recordAutomaticItemPress = useCallback((item: unknown) => {
    pendingAutomaticItemRef.current = item
  }, [])
  const contentContext = useMemo(
    () => ({
      addOnPosition,
      automaticPresentation,
      closingSnapshotActive: activeClosingSnapshotItems !== null,
      getObjectKey,
      grid,
      inputElementRef,
      inputGroupElementRef,
      recordAutomaticItemPress,
      setAddOnPosition,
      triggerElementRef,
      virtualized
    }),
    [
      activeClosingSnapshotItems,
      addOnPosition,
      automaticPresentation,
      getObjectKey,
      grid,
      recordAutomaticItemPress,
      virtualized
    ]
  )
  const rootProps = {
    ...props,
    defaultOpen,
    defaultValue: controlsAutomaticInlineValue ? undefined : defaultValue,
    filteredItems: (activeClosingSnapshotItems ?? filteredItems) as ItemValue[] | undefined,
    grid,
    inline,
    items,
    itemToStringValue: resolvedItemToStringValue,
    onOpenChange: (nextOpen: boolean, details: BaseUiAutocomplete.Root.ChangeEventDetails) => {
      const pendingAutomaticItem = pendingAutomaticItemRef.current

      if (
        pendingAutomaticItem !== undefined &&
        inline &&
        supportsAutomaticPresentation &&
        details.reason === 'item-press'
      ) {
        pendingAutomaticItemRef.current = undefined

        const automaticItemToStringValue = resolvedItemToStringValue as (item: ItemValue) => string
        let valueCanceled = false
        let valuePropagationAllowed = false
        const valueDetails = {
          allowPropagation: () => {
            valuePropagationAllowed = true
          },
          cancel: () => {
            valueCanceled = true
          },
          event: details.event,
          get isCanceled() {
            return valueCanceled
          },
          get isPropagationAllowed() {
            return valuePropagationAllowed
          },
          reason: 'item-press',
          trigger: details.trigger
        } as BaseUiAutocomplete.Root.ChangeEventDetails

        handleValueChange(
          automaticItemToStringValue(pendingAutomaticItem as ItemValue),
          valueDetails
        )
      }

      onOpenChange?.(nextOpen, details)

      if (details.isCanceled) {
        pendingSnapshotRef.current = null
        return
      }

      setUncontrolledOpen(nextOpen)

      if (nextOpen) {
        pendingSnapshotRef.current = null
        setClosingSnapshotItems(null)
        return
      }

      if (
        pendingSnapshotRef.current !== null &&
        details.reason === 'input-clear' &&
        pendingSnapshotRef.current.event === details.event
      ) {
        setClosingSnapshotItems(pendingSnapshotRef.current.items)
      }

      pendingSnapshotRef.current = null
    },
    onOpenChangeComplete: (nextOpen: boolean) => {
      if (!nextOpen) {
        pendingSnapshotRef.current = null
        setClosingSnapshotItems(null)
      }

      onOpenChangeComplete?.(nextOpen)
    },
    onValueChange: handleValueChange,
    open,
    value: controlsAutomaticInlineValue ? uncontrolledValue : value,
    virtualized
  } satisfies BaseUiAutocomplete.Root.Props<ItemValue>

  return (
    <autocompleteSizeContext.Provider value={size}>
      <autocompleteContentContext.Provider value={contentContext}>
        {createElement(
          BaseUiAutocomplete.Root as (
            rootProps: BaseUiAutocomplete.Root.Props<ItemValue>
          ) => ReactElement,
          rootProps,
          <AutocompleteSnapshotObserver filteredItemsRef={filteredItemsRef} />,
          children
        )}
      </autocompleteContentContext.Provider>
    </autocompleteSizeContext.Provider>
  )
}
