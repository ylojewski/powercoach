import { createSlice, type PayloadAction, type WithSlice } from '@reduxjs/toolkit'

import { rootReducer } from '@/core'
import { type Athlete } from '@/src/api'

export interface RosterState {
  activatedAthlete: Athlete | null
}

declare module '@/core/store' {
  interface ModuleSlices extends WithSlice<typeof rosterSlice> {}
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

rootReducer.inject(rosterSlice)

export function selectActivatedAthlete(state: { roster?: RosterState }): Athlete | null {
  return state.roster?.activatedAthlete ?? null
}
