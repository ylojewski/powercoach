import { useCallback } from 'react'

import { type Loadable, type LoadableStatus } from '@/core'
import { useRoster } from '@/modules/roster'
import { useSettings } from '@/modules/settings'

export function useModuleLoader(): Loadable {
  const rosterModule = useRoster()
  const settingsModule = useSettings()

  const load = useCallback((): VoidFunction => {
    const unloadSettings = settingsModule.load()
    const unloadRoster = rosterModule.load()

    return () => {
      unloadSettings()
      unloadRoster()
    }
  }, [rosterModule.load, settingsModule.load])

  const statuses: LoadableStatus[] = [rosterModule.status, settingsModule.status]
  const status: LoadableStatus = (() => {
    if (statuses.includes('error')) return 'error'
    if (statuses.every((status) => status === 'idle')) return 'idle'
    if (statuses.every((status) => status === 'ready')) return 'ready'
    return 'loading'
  })()

  return { load, status }
}
