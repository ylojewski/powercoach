import { configureStore } from '@reduxjs/toolkit'

import { rosterReducer } from '@/roster'
import { api } from '@/src/api'

export function createStore() {
  return configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    reducer: {
      [api.reducerPath]: api.reducer,
      roster: rosterReducer
    }
  })
}

export const store = createStore()

export type Store = ReturnType<typeof createStore>
export type State = ReturnType<Store['getState']>
export type Dispatch = Store['dispatch']
