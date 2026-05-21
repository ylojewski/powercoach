import { useCallback } from 'react'

import { type Loadable, getLoadableStatusFromQuery, useAppDispatch, api } from '@/core'

interface UseSettingsResult extends Loadable {
  defaultOrganizationId: number | null
}

export function useSettings(): UseSettingsResult {
  const dispatch = useAppDispatch()
  const settingsQuery = api.endpoints.getCurrentSettings.useQueryState()
  const status = getLoadableStatusFromQuery(settingsQuery)
  const defaultOrganizationId = settingsQuery.data?.defaultOrganizationId ?? null

  const load = useCallback((): VoidFunction => {
    const query = dispatch(api.endpoints.getCurrentSettings.initiate())

    return () => {
      query.unsubscribe()
    }
  }, [dispatch])

  return { defaultOrganizationId, load, status }
}
