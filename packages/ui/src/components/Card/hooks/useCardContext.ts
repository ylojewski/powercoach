import { useContext } from 'react'

import { cardContext, type CardContextValue } from '../constants/cardContext'

export function useCardContext(): CardContextValue {
  return useContext(cardContext)
}
