import { useCallback } from 'react'

import { type GetReferencesApiResponse, referencesApi } from '@/core'

interface UseReferencesResult {
  load: () => VoidFunction
  loading: boolean
  references: GetReferencesApiResponse | null
}

export function useReferences(): UseReferencesResult {
  const [trigger, { data, isLoading, isFetching }] = referencesApi.endpoints.getReferences.useLazyQuery()
  const references = data ?? null
  const loading = isLoading || isFetching

  const load = useCallback((): VoidFunction => {
    const query = trigger(undefined, true)
    return () => {
      query.abort()
      query.unsubscribe()
    }
  }, [trigger])

  return { load, loading, references }
}
