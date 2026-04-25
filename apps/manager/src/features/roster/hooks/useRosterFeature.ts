import { useCallback } from 'react'

import { type Athlete, type Coach, type Organization, rosterApi } from '@/src/api'
import { useSettingsFeature } from '@/src/features'
import { useAppDispatch, useAppSelector } from '@/src/hooks'
import { type Loadable, type Syncable } from '@/src/types'

import { activateAthlete, selectActivatedAthlete } from '../store'
import { getAthleteSlug } from '../utils'

interface RosterFeatureSyncPayload {
  athleteSlug?: string
}

export type RosterSyncResult = 'not-found' | 'pending' | 'synced'

interface UseRosterFeatureResult
  extends Loadable,
    Syncable<RosterFeatureSyncPayload, RosterSyncResult> {
  activatedAthlete: Athlete | null
  athletes: Athlete[]
  coach: Coach | null
  defaultOrganization: Organization | null
}

export function useRosterFeature(): UseRosterFeatureResult {
  const dispatch = useAppDispatch()
  const rosterQuery = rosterApi.endpoints.getCurrentRoster.useQueryState({})
  const { defaultOrganizationId } = useSettingsFeature()
  const activatedAthlete = useAppSelector(selectActivatedAthlete)

  const roster = rosterQuery.data
  const defaultOrganization =
    defaultOrganizationId === null
      ? null
      : (roster?.organizations.find(({ id }) => id === defaultOrganizationId) ?? null)

  const load = useCallback((): VoidFunction => {
    const query = dispatch(rosterApi.endpoints.getCurrentRoster.initiate({}))

    return () => {
      query.unsubscribe()
    }
  }, [dispatch])

  const sync = useCallback(
    ({ athleteSlug }: RosterFeatureSyncPayload): RosterSyncResult => {
      if (!roster) {
        return 'pending'
      }

      if (!athleteSlug) {
        dispatch(activateAthlete(null))
        return 'synced'
      }

      const athlete =
        roster.athletes.find((athlete) => getAthleteSlug(athlete) === athleteSlug) ?? null

      dispatch(activateAthlete(athlete))

      return athlete ? 'synced' : 'not-found'
    },
    [dispatch, roster]
  )

  return {
    activatedAthlete,
    athletes: roster?.athletes ?? [],
    coach: roster?.coach ?? null,
    defaultOrganization,
    isLoading: rosterQuery.isUninitialized || rosterQuery.isLoading || rosterQuery.isFetching,
    load,
    sync
  }
}
