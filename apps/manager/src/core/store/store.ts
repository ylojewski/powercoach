import { configureStore } from '@reduxjs/toolkit'

import { api } from '@/api'
import { rosterReducer } from '@/modules/roster'

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
