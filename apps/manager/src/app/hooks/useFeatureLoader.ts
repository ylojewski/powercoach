import { useCallback } from 'react'

import { type Loadable, type LoadableStatus } from '@/core'
import { useRoster } from '@/modules/roster'
import { useSettings } from '@/modules/settings'

export function useFeatureLoader(): Loadable {
  const rosterFeature = useRoster()
  const settingsFeature = useSettings()

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
