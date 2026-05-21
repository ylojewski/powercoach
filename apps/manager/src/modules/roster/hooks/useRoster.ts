import { useCallback, useEffect } from 'react'

import {
  type Loadable,
  getLoadableStatusFromQuery,
  useAppDispatch,
  useAppSelector,
  type Athlete,
  type Coach,
  type Organization,
  api,
  useBackgroundParams
} from '@/core'
import { useSettings } from '@/modules/settings'

import { activateAthlete, selectActivatedAthlete } from '../store'
import { getAthleteSlug } from '../utils'

interface UseRosterResult extends Loadable {
  activatedAthlete: Athlete | null
  athletes: Athlete[]
  coach: Coach | null
  defaultOrganization: Organization | null
}

export function useRoster(): UseRosterResult {
  const dispatch = useAppDispatch()
  const storedActivatedAthlete = useAppSelector(selectActivatedAthlete)
  const rosterQuery = api.endpoints.getCurrentRoster.useQueryState({})
  const status = getLoadableStatusFromQuery(rosterQuery)
  const { athleteSlug } = useBackgroundParams()
  const { defaultOrganizationId } = useSettings()

  const roster = rosterQuery.data
  const { athletes = [], coach = null, organizations = [] } = roster ?? {}

  const routedActivatedAthlete = athleteSlug
    ? (athletes.find((athlete) => getAthleteSlug(athlete) === athleteSlug) ?? null)
    : null
  const activatedAthlete = roster ? routedActivatedAthlete : storedActivatedAthlete
  const defaultOrganization = organizations.find(({ id }) => id === defaultOrganizationId) ?? null

  const load = useCallback((): VoidFunction => {
    const query = dispatch(api.endpoints.getCurrentRoster.initiate({}))

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
