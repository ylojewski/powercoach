import { athletes, coachOrganizations, coaches, organizations } from '@powercoach/db'
import { asc, eq } from 'drizzle-orm'
import { type RouteHandlerMethod } from 'fastify'

import { type CoachContextResponse } from './schemas'

export const COACH_EMAIL_HEADER = 'x-coach-email' as const

export function getCoachEmailHeader(value: string | string[] | undefined): string | null {
  return typeof value === 'string' ? value.trim() || null : null
}

export const getCurrentCoachContext: RouteHandlerMethod = async (
  request
): Promise<CoachContextResponse> => {
  const coachEmailHeader = request.headers[COACH_EMAIL_HEADER]
  const coachEmail = getCoachEmailHeader(coachEmailHeader)

  if (!coachEmail) {
    throw request.server.httpErrors.badRequest(`Missing "${COACH_EMAIL_HEADER}" header`)
  }

  const [coach] = await request.server.db
    .select({
      email: coaches.email,
      firstName: coaches.firstName,
      id: coaches.id,
      lastName: coaches.lastName
    })
    .from(coaches)
    .where(eq(coaches.email, coachEmail))
    .limit(1)

  if (!coach) {
    throw request.server.httpErrors.notFound(`Coach "${coachEmail}" not found`)
  }

  const [resolvedOrganizations, resolvedAthletes] = await Promise.all([
    request.server.db
      .select({
        id: organizations.id,
        name: organizations.name
      })
      .from(coachOrganizations)
      .innerJoin(organizations, eq(coachOrganizations.organizationId, organizations.id))
      .where(eq(coachOrganizations.coachId, coach.id))
      .orderBy(asc(organizations.id)),
    request.server.db
      .select({
        email: athletes.email,
        firstName: athletes.firstName,
        id: athletes.id,
        lastName: athletes.lastName
      })
      .from(athletes)
      .where(eq(athletes.coachId, coach.id))
      .orderBy(asc(athletes.id))
  ])

  return {
    athletes: resolvedAthletes,
    coach,
    organizations: resolvedOrganizations
  }
}
