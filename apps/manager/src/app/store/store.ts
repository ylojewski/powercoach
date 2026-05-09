import { configureStore } from '@reduxjs/toolkit'

import { rootReducer, api } from '@/core'

import { routerConfig } from '../router'

export function createStore() {
  return configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    preloadedState: {
      router: routerConfig
    },
    reducer: rootReducer
  })
}

export const store = createStore()

export type Store = ReturnType<typeof createStore>
