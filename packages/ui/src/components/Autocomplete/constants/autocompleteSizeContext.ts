import { createContext } from 'react'

import { type AutocompleteSize } from '../types/AutocompleteTypes'

export const autocompleteSizeContext = createContext<AutocompleteSize>('xl')
