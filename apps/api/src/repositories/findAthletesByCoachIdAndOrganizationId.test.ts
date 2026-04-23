import { coachOrganizations, coachSettings, coaches, organizations } from '@powercoach/db'
import {
  EMPTY_ORGANIZATION,
  COACH_EMAIL,
  PRIMARY_ATHLETE_ROW,
  SECONDARY_ATHLETE_ROW
} from '@powercoach/util-fixture'
import { eq } from 'drizzle-orm'

import { appTest } from '@/test/utils'

import { findAthletesByCoachIdAndOrganizationId } from './findAthletesByCoachIdAndOrganizationId'

describe('findAthletesByCoachIdAndOrganizationId repository', () => {
  appTest('returns athletes for the coach and organization ordered by id', async ({ app }) => {
    const [coach] = await app.db
      .select({ id: coaches.id })
      .from(coaches)
      .where(eq(coaches.email, COACH_EMAIL))
      .limit(1)

    if (!coach) {
      throw new Error(`Expected seeded coach "${COACH_EMAIL}" to exist`)
    }

    const [settings] = await app.db
      .select({ defaultOrganizationId: coachSettings.defaultOrganizationId })
      .from(coachSettings)
      .where(eq(coachSettings.coachId, coach.id))
      .limit(1)

    if (!settings) {
      throw new Error(`Expected seeded settings for coach "${COACH_EMAIL}" to exist`)
    }

    await expect(
      findAthletesByCoachIdAndOrganizationId(app.db, coach.id, settings.defaultOrganizationId)
    ).resolves.toStrictEqual([
      {
        ...PRIMARY_ATHLETE_ROW,
        coachId: coach.id,
        id: expect.any(Number),
        organizationId: settings.defaultOrganizationId
      },
      {
        ...SECONDARY_ATHLETE_ROW,
        coachId: coach.id,
        id: expect.any(Number),
        organizationId: settings.defaultOrganizationId
      }
    ])
  })

  appTest('returns an empty list when no athlete matches the couple', async ({ app }) => {
    const [coach] = await app.db
      .select({ id: coaches.id })
      .from(coaches)
      .where(eq(coaches.email, COACH_EMAIL))
      .limit(1)

    if (!coach) {
      throw new Error(`Expected seeded coach "${COACH_EMAIL}" to exist`)
    }

    const [organization] = await app.db
      .insert(organizations)
      .values(EMPTY_ORGANIZATION)
      .returning({ id: organizations.id })

    if (!organization) {
      throw new Error('Expected inserted empty organization to exist')
    }

    await app.db.insert(coachOrganizations).values({
      coachId: coach.id,
      organizationId: organization.id
    })

    await expect(
      findAthletesByCoachIdAndOrganizationId(app.db, coach.id, organization.id)
    ).resolves.toStrictEqual([])
  })
})
