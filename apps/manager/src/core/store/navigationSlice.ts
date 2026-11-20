import { createSlice } from '@reduxjs/toolkit'

import { type NavigationState } from '../types'
import { type State } from './reducer'

export const navigationSlice = createSlice({
  initialState: {} as NavigationState,
  name: 'navigation',
  reducers: {}
})

export function selectNavigationState(state: State): NavigationState {
  return state.navigation
}
