import { configureStore } from '@reduxjs/toolkit'

import { routerConfig } from '@/app/router'
import { rootReducer, api } from '@/core'

export function createTestStore() {
  return configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    preloadedState: { router: routerConfig },
    reducer: rootReducer
  })
}
