import { createContext } from 'react'

import { type RailsOrientation } from '../types/RailsOrientation'

export const railsOrientationContext = createContext<RailsOrientation>('vertical')
