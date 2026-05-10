import { configureStore } from '@reduxjs/toolkit'

import { routerConfig } from '@/app/router'
import { reducer, api } from '@/core'

export function createTestStore() {
  return configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    preloadedState: { router: routerConfig },
    reducer: reducer
  })
}
