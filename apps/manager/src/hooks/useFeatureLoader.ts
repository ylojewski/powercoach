import { useCallback } from 'react'

import { useRosterFeature, useSettingsFeature } from '@/src/features'
import { type Loadable, type LoadableStatus } from '@/src/types'

export function useFeatureLoader(): Loadable {
  const rosterFeature = useRosterFeature()
  const settingsFeature = useSettingsFeature()

  const load = useCallback((): VoidFunction => {
    const unloadSettings = settingsFeature.load()
    const unloadRoster = rosterFeature.load()

    return () => {
      unloadSettings()
      unloadRoster()
    }
  }, [rosterFeature.load, settingsFeature.load])

  const statuses: LoadableStatus[] = [rosterFeature.status, settingsFeature.status]
  const status: LoadableStatus = (() => {
    if (statuses.includes('error')) return 'error'
    if (statuses.every((status) => status === 'idle')) return 'idle'
    if (statuses.every((status) => status === 'ready')) return 'ready'
    return 'loading'
  })()

  return { load, status }
}
