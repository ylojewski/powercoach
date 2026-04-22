import { coaches } from '@powercoach/db'

import { type RosterResponse } from '@/src/modules'
import { COACH_EMAIL_HEADER } from '@/src/plugins'
import { appTest } from '@/test/utils'

const SEEDED_COACH_EMAIL = 'astra.quill@example.test' as const

describe('GET /v1/roster/me roster route', () => {
  appTest('returns the seeded roster', async ({ app }) => {
    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: SEEDED_COACH_EMAIL },
      method: 'GET',
      url: '/v1/roster/me'
    })
    const payload = response.json<RosterResponse>()

    expect(response.statusCode).toBe(200)
    expect(payload).toStrictEqual<RosterResponse>({
      athletes: [
        {
          email: 'kiro.flux@example.test',
          firstName: 'Kiro',
          id: expect.any(Number),
          lastName: 'Flux',
          organizationId: expect.any(Number)
        },
        {
          email: 'nexa.vale@example.test',
          firstName: 'Nexa',
          id: expect.any(Number),
          lastName: 'Vale',
          organizationId: expect.any(Number)
        }
      ],
      coach: {
        email: SEEDED_COACH_EMAIL,
        firstName: 'Astra',
        id: expect.any(Number),
        lastName: 'Quill'
      },
      organizations: [
        {
          id: expect.any(Number),
          name: 'Orbit Foundry'
        },
        {
          id: expect.any(Number),
          name: 'Nova Athletics'
        }
      ]
    })
    expect(payload.coach).not.toHaveProperty('password')
    payload.athletes.forEach((athlete) => {
      expect(athlete).not.toHaveProperty('password')
    })
  })

  appTest(
    'returns the selected organization roster when organizationId is provided',
    async ({ app }) => {
      const currentRosterResponse = await app.inject({
        headers: { [COACH_EMAIL_HEADER]: SEEDED_COACH_EMAIL },
        method: 'GET',
        url: '/v1/roster/me'
      })
      const currentRoster = currentRosterResponse.json<RosterResponse>()
      const selectedOrganization = currentRoster.organizations.find(
        (organization) => organization.name === 'Nova Athletics'
      )

      if (!selectedOrganization) {
        throw new Error('Expected "Nova Athletics" to exist in the seeded roster')
      }

      const response = await app.inject({
        headers: { [COACH_EMAIL_HEADER]: SEEDED_COACH_EMAIL },
        method: 'GET',
        url: `/v1/roster/me?organizationId=${selectedOrganization.id}`
      })
      const payload = response.json<RosterResponse>()

      expect(response.statusCode).toBe(200)
      expect(payload.athletes).toStrictEqual([
        {
          email: 'tomo.pixel@example.test',
          firstName: 'Tomo',
          id: expect.any(Number),
          lastName: 'Pixel',
          organizationId: selectedOrganization.id
        }
      ])
      expect(payload.organizations).toStrictEqual(currentRoster.organizations)
    }
  )

  appTest('returns unauthorized when the coach email header is missing', async ({ app }) => {
    const response = await app.inject({ method: 'GET', url: '/v1/roster/me' })
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
      url: '/v1/roster/me'
    })
    const payload = response.json()

    expect(response.statusCode).toBe(401)
    expect(payload).toMatchObject({
      error: 'Unauthorized',
      message: 'Coach "ghost.coach@example.test" not found',
      statusCode: 401
    })
  })

  appTest('returns not found when the organization is not linked to the coach', async ({ app }) => {
    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: SEEDED_COACH_EMAIL },
      method: 'GET',
      url: '/v1/roster/me?organizationId=999999'
    })
    const payload = response.json()

    expect(response.statusCode).toBe(404)
    expect(payload).toMatchObject({
      error: 'Not Found',
      message: `Organization "999999" not found for coach "${SEEDED_COACH_EMAIL}"`,
      statusCode: 404
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
      url: '/v1/roster/me'
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
