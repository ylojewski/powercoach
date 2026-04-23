import {
  COACH_ROW,
  DEFAULT_ORGANIZATION,
  PRIMARY_ATHLETE_ROW,
  SECONDARY_ATHLETE_ROW,
  SECONDARY_ORGANIZATION,
  TERTIARY_ATHLETE_ROW
} from '@powercoach/util-fixture'
import { type NodePgDatabase } from 'drizzle-orm/node-postgres'

import { athletes, coachOrganizations, coachSettings, coaches, organizations } from '@/src/schema'

export async function execute(db: NodePgDatabase) {
  const [coach] = await db.insert(coaches).values(COACH_ROW).returning({ id: coaches.id })

  const [defaultOrganization, secondaryOrganization] = await db
    .insert(organizations)
    .values([DEFAULT_ORGANIZATION, SECONDARY_ORGANIZATION])
    .returning({ id: organizations.id })

  if (!coach || !defaultOrganization || !secondaryOrganization) {
    throw new Error('Failed to seed roster data')
  }

  await db.insert(coachOrganizations).values([
    {
      coachId: coach.id,
      organizationId: defaultOrganization.id
    },
    {
      coachId: coach.id,
      organizationId: secondaryOrganization.id
    }
  ])

  await db.insert(coachSettings).values({
    coachId: coach.id,
    defaultOrganizationId: defaultOrganization.id
  })

  await db.insert(athletes).values([
    {
      ...PRIMARY_ATHLETE_ROW,
      coachId: coach.id,
      organizationId: defaultOrganization.id
    },
    {
      ...SECONDARY_ATHLETE_ROW,
      coachId: coach.id,
      organizationId: defaultOrganization.id
    },
    {
      ...TERTIARY_ATHLETE_ROW,
      coachId: coach.id,
      organizationId: secondaryOrganization.id
    }
  ])
}
