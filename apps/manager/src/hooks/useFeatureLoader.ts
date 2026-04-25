import { useCallback } from 'react'

import { useRosterFeature, useSettingsFeature } from '@/src/features'
import { type Loadable } from '@/src/types'

export function useFeatureLoader(): Loadable {
  const { isLoading: isRosterLoading, load: loadRoster } = useRosterFeature()
  const { isLoading: isSettingsLoading, load: loadSettings } = useSettingsFeature()

  const load = useCallback((): VoidFunction => {
    const unloadSettings = loadSettings()
    const unloadRoster = loadRoster()

    return () => {
      unloadSettings()
      unloadRoster()
    }
  }, [loadRoster, loadSettings])

  return {
    isLoading: isSettingsLoading || isRosterLoading,
    load
  }
}
