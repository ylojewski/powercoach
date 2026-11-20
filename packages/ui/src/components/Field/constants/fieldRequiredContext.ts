import { createContext, type RefObject } from 'react'

export interface FieldRequiredContextValue {
  controlRef: RefObject<HTMLElement | null> | null
  invalidateValidationOwnership: () => void
  required: boolean
}

export const fieldRequiredContext = createContext<FieldRequiredContextValue>({
  controlRef: null,
  invalidateValidationOwnership: () => undefined,
  required: false
})
