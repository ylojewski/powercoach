import { coaches } from '@powercoach/db'

import { type SettingsResponse } from '@/src/modules'
import { COACH_EMAIL_HEADER } from '@/src/plugins'
import { appTest } from '@/test/utils'

const SEEDED_COACH_EMAIL = 'astra.quill@example.test' as const

describe('GET /v1/settings/me settings route', () => {
  appTest('returns the seeded settings', async ({ app }) => {
    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: SEEDED_COACH_EMAIL },
      method: 'GET',
      url: '/v1/settings/me'
    })
    const payload = response.json<SettingsResponse>()

    expect(response.statusCode).toBe(200)
    expect(payload).toStrictEqual<SettingsResponse>({
      defaultOrganizationId: expect.any(Number)
    })
  })

  appTest('returns unauthorized when the coach email header is missing', async ({ app }) => {
    const response = await app.inject({ method: 'GET', url: '/v1/settings/me' })
    const payload = response.json()

    expect(response.statusCode).toBe(401)
    expect(payload).toMatchObject({
      error: 'Unauthorized',
      message: `Missing "${COACH_EMAIL_HEADER}" header`,
      statusCode: 401
    })
  })

  appTest('returns unauthorized when the coach does not exist', async ({ app }) => {
    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: 'ghost.coach@example.test' },
      method: 'GET',
      url: '/v1/settings/me'
    })
    const payload = response.json()

    expect(response.statusCode).toBe(401)
    expect(payload).toMatchObject({
      error: 'Unauthorized',
      message: 'Coach "ghost.coach@example.test" not found',
      statusCode: 401
    })
  })

  appTest('returns an explicit server error when coach settings are missing', async ({ app }) => {
    await app.db.insert(coaches).values({
      email: 'missing.settings@example.test',
      firstName: 'Missing',
      lastName: 'Settings',
      password: 'powercoach-demo'
    })

    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: 'missing.settings@example.test' },
      method: 'GET',
      url: '/v1/settings/me'
    })
    const payload = response.json()

    expect(response.statusCode).toBe(500)
    expect(payload).toMatchObject({
      error: 'Internal Server Error',
      message: 'Coach settings for "missing.settings@example.test" are invalid',
      statusCode: 500
    })
  })
})
