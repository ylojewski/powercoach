import { configureStore } from '@reduxjs/toolkit'

import { rootReducer } from '@/core'
import { api } from '@/src/api'
import { routerConfig } from '@/src/app/router'

export function createTestStore() {
  return configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    preloadedState: { router: routerConfig },
    reducer: rootReducer
  })
}
