import { configureStore } from '@reduxjs/toolkit'

import { managerApi } from './manager'

export function createStore() {
  return configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(managerApi.middleware),
    reducer: {
      [managerApi.reducerPath]: managerApi.reducer
    }
  })
}

export const store = createStore()

export type Store = ReturnType<typeof createStore>
export type State = ReturnType<Store['getState']>
export type Dispatch = Store['dispatch']
