import { type FastifyRequest, type RouteGenericInterface } from 'fastify'

import { InvalidCoachSettingsError } from '@/src/errors'
import {
  findAthletesByCoachIdAndOrganizationId,
  findCoachOrganizationsByCoachId,
  findCoachSettingsByCoachId
} from '@/src/repositories'

import { parseOrganizationId, type RosterQuerystring, type RosterResponse } from './schemas'

export { COACH_EMAIL_HEADER, getCoachEmailHeader } from '@/src/plugins'

interface GetCurrentRosterRoute extends RouteGenericInterface {
  Querystring: RosterQuerystring
}

export const getCurrentRoster = async (
  request: FastifyRequest<GetCurrentRosterRoute>
): Promise<RosterResponse> => {
  const [rosterSettings, rosterOrganizations] = await Promise.all([
    findCoachSettingsByCoachId(request.server.db, request.coach.id),
    findCoachOrganizationsByCoachId(request.server.db, request.coach.id)
  ])

  if (!rosterSettings) {
    throw new InvalidCoachSettingsError(request.coach.email)
  }

  const requestedOrganizationId = parseOrganizationId(request.query)
  const { defaultOrganizationId } = rosterSettings
  const requestedOrganization = rosterOrganizations.find(({ id }) => id === requestedOrganizationId)
  const defaultOrganization = rosterOrganizations.find(({ id }) => id === defaultOrganizationId)

  if (requestedOrganizationId !== undefined && !requestedOrganization) {
    throw request.server.httpErrors.notFound(
      `Organization "${requestedOrganizationId}" not found for coach "${request.coach.email}"`
    )
  }

  if (requestedOrganizationId === undefined && !defaultOrganization) {
    throw new InvalidCoachSettingsError(request.coach.email)
  }

  const rosterAthletes = await findAthletesByCoachIdAndOrganizationId(
    request.server.db,
    request.coach.id,
    requestedOrganizationId ?? defaultOrganizationId
  )

  return {
    athletes: rosterAthletes,
    coach: request.coach,
    organizations: rosterOrganizations
  }
}
