import { useCallback } from 'react'

import { useAppDispatch, type Loadable, getLoadableStatusFromQuery } from '@/core'
import { settingsApi } from '@/src/api'

interface UseSettingsFeatureResult extends Loadable {
  defaultOrganizationId: number | null
}

export function useSettingsFeature(): UseSettingsFeatureResult {
  const dispatch = useAppDispatch()
  const settingsQuery = settingsApi.endpoints.getCurrentSettings.useQueryState()
  const status = getLoadableStatusFromQuery(settingsQuery)
  const defaultOrganizationId = settingsQuery.data?.defaultOrganizationId ?? null

  const load = useCallback((): VoidFunction => {
    const query = dispatch(settingsApi.endpoints.getCurrentSettings.initiate())

    return () => {
      query.unsubscribe()
    }
  }, [dispatch])

  return { defaultOrganizationId, load, status }
}
