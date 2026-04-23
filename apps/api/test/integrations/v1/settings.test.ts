import { coaches } from '@powercoach/db'
import { MISSING_SETTINGS_COACH, COACH_EMAIL } from '@powercoach/util-fixture'

import { type SettingsResponse } from '@/src/modules'
import { COACH_EMAIL_HEADER } from '@/src/plugins'
import { appTest } from '@/test/utils'

describe('GET /v1/settings/me settings route', () => {
  appTest('returns the seeded settings', async ({ app }) => {
    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: COACH_EMAIL },
      method: 'GET',
      url: '/v1/settings/me'
    })
    const payload = response.json<SettingsResponse>()

    expect(response.statusCode).toBe(200)
    expect(payload).toStrictEqual<SettingsResponse>({
      defaultOrganizationId: expect.any(Number)
    })
  })

  appTest('returns an explicit server error when coach settings are missing', async ({ app }) => {
    await app.db.insert(coaches).values(MISSING_SETTINGS_COACH)

    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: MISSING_SETTINGS_COACH.email },
      method: 'GET',
      url: '/v1/settings/me'
    })
    const payload = response.json()

    expect(response.statusCode).toBe(500)
    expect(payload).toMatchObject({
      error: 'Internal Server Error',
      message: `Coach settings for "${MISSING_SETTINGS_COACH.email}" are invalid`,
      statusCode: 500
    })
  })
})
