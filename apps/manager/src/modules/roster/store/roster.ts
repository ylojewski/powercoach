import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { type Athlete } from '@/src/api'

export interface RosterState {
  activatedAthlete: Athlete | null
}

interface RosterSliceState {
  roster: RosterState
}

const initialState: RosterState = {
  activatedAthlete: null
}

const rosterSlice = createSlice({
  initialState,
  name: 'roster',
  reducers: {
    activateAthlete(state, action: PayloadAction<Athlete | null>) {
      state.activatedAthlete = action.payload
    }
  }
})

export const { activateAthlete } = rosterSlice.actions
export const { reducer: rosterReducer } = rosterSlice

export function selectActivatedAthlete(state: RosterSliceState): Athlete | null {
  return state.roster.activatedAthlete
}
