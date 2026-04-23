import { coaches } from '@powercoach/db'
import { MISSING_SETTINGS_COACH, COACH_EMAIL } from '@powercoach/util-fixture'
import { eq } from 'drizzle-orm'

import { appTest } from '@/test/utils'

import { findCoachSettingsByCoachId } from './findCoachSettingsByCoachId'

describe('findCoachSettingsByCoachId repository', () => {
  appTest('returns coach settings when they exist', async ({ app }) => {
    const [coach] = await app.db
      .select({ id: coaches.id })
      .from(coaches)
      .where(eq(coaches.email, COACH_EMAIL))
      .limit(1)

    if (!coach) {
      throw new Error(`Expected seeded coach "${COACH_EMAIL}" to exist`)
    }

    await expect(findCoachSettingsByCoachId(app.db, coach.id)).resolves.toStrictEqual({
      coachId: coach.id,
      defaultOrganizationId: expect.any(Number)
    })
  })

  appTest('returns null when coach settings do not exist', async ({ app }) => {
    const [coach] = await app.db
      .insert(coaches)
      .values(MISSING_SETTINGS_COACH)
      .returning({ id: coaches.id })

    if (!coach) {
      throw new Error('Expected inserted coach without settings to exist')
    }

    await expect(findCoachSettingsByCoachId(app.db, coach.id)).resolves.toBeNull()
  })
})
