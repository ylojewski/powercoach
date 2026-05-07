import { type LoaderFunction } from 'react-router'

import { rosterApi, settingsApi } from '@/api'

import { type Store } from '../store'

interface StartupLoad {
  promise: Promise<null>
  unsubscribe: VoidFunction
}

function loadStartupFeatures(store: Store): StartupLoad {
  const settingsQuery = store.dispatch(settingsApi.endpoints.getCurrentSettings.initiate())
  const rosterQuery = store.dispatch(rosterApi.endpoints.getCurrentRoster.initiate({}))

  return {
    promise: Promise.all([settingsQuery.unwrap(), rosterQuery.unwrap()]).then(() => null),
    unsubscribe: () => {
      settingsQuery.unsubscribe()
      rosterQuery.unsubscribe()
    }
  }
}

export function createStartupLoader(store: Store): LoaderFunction {
  let startupLoad: StartupLoad | null = null

  return () => {
    startupLoad ??= loadStartupFeatures(store)
    const currentStartupLoad = startupLoad

    return currentStartupLoad.promise.catch((error: unknown) => {
      currentStartupLoad.unsubscribe()
      startupLoad = null
      throw error
    })
  }
}
