import { coaches } from '@powercoach/db'
import {
  NO_ORGANIZATIONS_COACH,
  COACH_EMAIL,
  DEFAULT_ORGANIZATION,
  SECONDARY_ORGANIZATION
} from '@powercoach/util-fixture'
import { eq } from 'drizzle-orm'

import { appTest } from '@/test/utils'

import { findCoachOrganizationsByCoachId } from './findCoachOrganizationsByCoachId'

describe('findCoachOrganizationsByCoachId repository', () => {
  appTest('returns the coach organizations ordered by id', async ({ app }) => {
    const [coach] = await app.db
      .select({ id: coaches.id })
      .from(coaches)
      .where(eq(coaches.email, COACH_EMAIL))
      .limit(1)

    if (!coach) {
      throw new Error(`Expected seeded coach "${COACH_EMAIL}" to exist`)
    }

    await expect(findCoachOrganizationsByCoachId(app.db, coach.id)).resolves.toStrictEqual([
      { id: expect.any(Number), name: DEFAULT_ORGANIZATION.name },
      { id: expect.any(Number), name: SECONDARY_ORGANIZATION.name }
    ])
  })

  appTest('returns an empty list when the coach has no organizations', async ({ app }) => {
    const [coach] = await app.db
      .insert(coaches)
      .values(NO_ORGANIZATIONS_COACH)
      .returning({ id: coaches.id })

    if (!coach) {
      throw new Error('Expected inserted coach without organizations to exist')
    }

    await expect(findCoachOrganizationsByCoachId(app.db, coach.id)).resolves.toStrictEqual([])
  })
})
