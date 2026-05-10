import { createSlice } from '@reduxjs/toolkit'

import { type State } from './reducer'

export interface RouterConfig {
  Exercises: {
    New: string
    Index: string
  }
  Home: {
    AthleteRoot: string
    Index: string
  }
  Metrics: {
    AthleteRoot: string
    Index: string
  }
  Notes: {
    AthleteRoot: string
    Index: string
  }
  Programs: {
    AthleteRoot: string
    Index: string
  }
  Reviews: {
    AthleteRoot: string
    Index: string
  }
}

export const routerSlice = createSlice({
  initialState: {} as RouterConfig,
  name: 'router',
  reducers: {}
})

export function selectRouterConfig(state: State): RouterConfig {
  return state.router
}
