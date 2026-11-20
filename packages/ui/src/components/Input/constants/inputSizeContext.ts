import { createContext } from 'react'

import { type InputSize } from '../types/InputTypes'

export const inputSizeContext = createContext<InputSize>('xl')
