import { usePendingQuery } from './usePendingQuery'

import { useGetExerciseCodeQuery, useGetReferencesQuery, useGetCurrentRosterQuery, useGetCurrentSettingsQuery, useGetHealthStatusQuery } from '../api'

export const usePendingGetExerciseCodeQuery = usePendingQuery(useGetExerciseCodeQuery)
export const usePendingGetReferencesQuery = usePendingQuery(useGetReferencesQuery)
export const usePendingGetCurrentRosterQuery = usePendingQuery(useGetCurrentRosterQuery)
export const usePendingGetCurrentSettingsQuery = usePendingQuery(useGetCurrentSettingsQuery)
export const usePendingGetHealthStatusQuery = usePendingQuery(useGetHealthStatusQuery)