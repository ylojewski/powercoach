import { configureStore } from '@reduxjs/toolkit'

import { rootReducer } from '@/core'
import { api } from '@/src/api'

export function createStore() {
  return configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    reducer: rootReducer
  })
}

export const store = createStore()

export type Store = ReturnType<typeof createStore>
