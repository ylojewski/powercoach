import { createContext } from 'react'

export const autocompleteGroupItemsContext = createContext<readonly unknown[] | undefined>(
  undefined
)
