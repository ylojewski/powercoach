import { useCallback } from 'react'

import { settingsApi } from '@/src/api'
import { useAppDispatch } from '@/src/hooks'
import { type Loadable } from '@/src/types'

interface UseSettingsFeatureResult extends Loadable {
  defaultOrganizationId: number | null
}

export function useSettingsFeature(): UseSettingsFeatureResult {
  const dispatch = useAppDispatch()
  const settingsQuery = settingsApi.endpoints.getCurrentSettings.useQueryState()

  const load = useCallback((): VoidFunction => {
    const query = dispatch(settingsApi.endpoints.getCurrentSettings.initiate())

    return () => {
      query.unsubscribe()
    }
  }, [dispatch])

  return {
    defaultOrganizationId: settingsQuery.data?.defaultOrganizationId ?? null,
    isLoading: settingsQuery.isUninitialized || settingsQuery.isLoading || settingsQuery.isFetching,
    load
  }
}
