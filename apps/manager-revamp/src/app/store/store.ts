import { configureStore } from '@reduxjs/toolkit'

import { api, reducer } from '@/core'

import { navigationState } from '../constants'

export function createStore() {
  return configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    preloadedState: {
      navigation: navigationState
    },
    reducer
  })
}

export const store = createStore()

export type Store = ReturnType<typeof createStore>
