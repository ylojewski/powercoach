import { useCallback, useMemo } from 'react'

import { type GetReferencesApiResponse, api, useAppDispatch } from '@/core'

import { type ExerciseGroupItemByPattern, groupExercisesByPatternItem } from '../utils'

interface UseReferencesResult {
  exerciseGroupItemsByPattern: ExerciseGroupItemByPattern[]
  load: () => VoidFunction
  loading: boolean
  references: GetReferencesApiResponse | null
}

export function useReferences(): UseReferencesResult {
  const dispatch = useAppDispatch()
  const referencesQuery = api.endpoints.getReferences.useQueryState()
  const references = referencesQuery.data ?? null
  const loading = references === null && (referencesQuery.isLoading || referencesQuery.isFetching)

  const exerciseGroupItemsByPattern = useMemo((): ExerciseGroupItemByPattern[] => {
    return references ? groupExercisesByPatternItem(references) : []
  }, [references])

  const load = useCallback((): VoidFunction => {
    const query = dispatch(api.endpoints.getReferences.initiate())

    return () => {
      query.unsubscribe()
    }
  }, [dispatch])

  return { exerciseGroupItemsByPattern, load, loading, references }
}
