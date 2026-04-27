import { useCallback, useEffect } from 'react'
import { useParams } from 'react-router'

import { useAppDispatch, useAppSelector, type Loadable, getLoadableStatusFromQuery } from '@/core'
import { useSettingsFeature } from '@/settings'
import { type Athlete, type Coach, type Organization, rosterApi } from '@/src/api'

import { activateAthlete, selectActivatedAthlete } from '../store'
import { getAthleteSlug } from '../utils'

interface UseRosterFeatureResult extends Loadable {
  activatedAthlete: Athlete | null
  athletes: Athlete[]
  coach: Coach | null
  defaultOrganization: Organization | null
}

export function useRosterFeature(): UseRosterFeatureResult {
  const dispatch = useAppDispatch()
  const storedActivatedAthlete = useAppSelector(selectActivatedAthlete)
  const rosterQuery = rosterApi.endpoints.getCurrentRoster.useQueryState({})
  const status = getLoadableStatusFromQuery(rosterQuery)
  const { athleteSlug } = useParams()
  const { defaultOrganizationId } = useSettingsFeature()

  const roster = rosterQuery.data
  const { athletes = [], coach = null, organizations = [] } = roster ?? {}

  const routedActivatedAthlete = athleteSlug
    ? (athletes.find((athlete) => getAthleteSlug(athlete) === athleteSlug) ?? null)
    : null
  const activatedAthlete = roster ? routedActivatedAthlete : storedActivatedAthlete
  const defaultOrganization = organizations.find(({ id }) => id === defaultOrganizationId) ?? null

  const load = useCallback((): VoidFunction => {
    const query = dispatch(rosterApi.endpoints.getCurrentRoster.initiate({}))

    return () => {
      query.unsubscribe()
    }
  }, [dispatch])

  useEffect(() => {
    if (!roster) return
    if ((storedActivatedAthlete?.id ?? null) === (routedActivatedAthlete?.id ?? null)) return

    dispatch(activateAthlete(routedActivatedAthlete))
  }, [dispatch, roster, routedActivatedAthlete, storedActivatedAthlete?.id])

  return {
    activatedAthlete,
    athletes,
    coach,
    defaultOrganization,
    load,
    status
  }
}
