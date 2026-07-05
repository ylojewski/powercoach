export type AutocompleteAutomaticPresentation = 'flat' | 'grouped'

export function resolveAutocompleteAutomaticPresentation(
  items: readonly unknown[] | undefined
): AutocompleteAutomaticPresentation | null {
  if (items === undefined || items.length === 0) {
    return null
  }

  const containsGroupCandidate = items.some(
    (item) => typeof item === 'object' && item !== null && Array.isArray(Reflect.get(item, 'items'))
  )

  if (containsGroupCandidate) {
    return items.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof Reflect.get(item, 'text') === 'string' &&
        Array.isArray(Reflect.get(item, 'items')) &&
        (Reflect.get(item, 'items') as unknown[]).every(
          (groupItem) =>
            typeof groupItem === 'object' &&
            groupItem !== null &&
            typeof Reflect.get(groupItem, 'text') === 'string'
        )
    )
      ? 'grouped'
      : null
  }

  if (
    items.every(
      (item) =>
        typeof item === 'object' && item !== null && typeof Reflect.get(item, 'text') === 'string'
    )
  ) {
    return 'flat'
  }

  return null
}
