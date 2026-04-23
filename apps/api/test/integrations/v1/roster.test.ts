import { coaches } from '@powercoach/db'
import {
  MISSING_SETTINGS_COACH,
  COACH,
  COACH_EMAIL,
  DEFAULT_ORGANIZATION,
  PRIMARY_ATHLETE,
  SECONDARY_ATHLETE,
  SECONDARY_ORGANIZATION,
  TERTIARY_ATHLETE
} from '@powercoach/util-fixture'

import { type RosterResponse } from '@/src/modules'
import { COACH_EMAIL_HEADER } from '@/src/plugins'
import { appTest } from '@/test/utils'

describe('GET /v1/roster/me roster route', () => {
  appTest('returns the seeded roster', async ({ app }) => {
    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: COACH_EMAIL },
      method: 'GET',
      url: '/v1/roster/me'
    })
    const payload = response.json<RosterResponse>()

    expect(response.statusCode).toBe(200)
    expect(payload).toStrictEqual<RosterResponse>({
      athletes: [
        {
          ...PRIMARY_ATHLETE,
          id: expect.any(Number),
          organizationId: expect.any(Number)
        },
        {
          ...SECONDARY_ATHLETE,
          id: expect.any(Number),
          organizationId: expect.any(Number)
        }
      ],
      coach: {
        ...COACH,
        id: expect.any(Number)
      },
      organizations: [
        {
          id: expect.any(Number),
          name: DEFAULT_ORGANIZATION.name
        },
        {
          id: expect.any(Number),
          name: SECONDARY_ORGANIZATION.name
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
        headers: { [COACH_EMAIL_HEADER]: COACH_EMAIL },
        method: 'GET',
        url: '/v1/roster/me'
      })
      const currentRoster = currentRosterResponse.json<RosterResponse>()
      const selectedOrganization = currentRoster.organizations.find(
        (organization) => organization.name === SECONDARY_ORGANIZATION.name
      )

      if (!selectedOrganization) {
        throw new Error(`Expected "${SECONDARY_ORGANIZATION.name}" to exist in the seeded roster`)
      }

      const response = await app.inject({
        headers: { [COACH_EMAIL_HEADER]: COACH_EMAIL },
        method: 'GET',
        url: `/v1/roster/me?organizationId=${selectedOrganization.id}`
      })
      const payload = response.json<RosterResponse>()

      expect(response.statusCode).toBe(200)
      expect(payload.athletes).toStrictEqual([
        {
          ...TERTIARY_ATHLETE,
          id: expect.any(Number),
          organizationId: selectedOrganization.id
        }
      ])
      expect(payload.organizations).toStrictEqual(currentRoster.organizations)
    }
  )

  appTest('returns not found when the organization is not linked to the coach', async ({ app }) => {
    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: COACH_EMAIL },
      method: 'GET',
      url: '/v1/roster/me?organizationId=999999'
    })
    const payload = response.json()

    expect(response.statusCode).toBe(404)
    expect(payload).toMatchObject({
      error: 'Not Found',
      message: `Organization "999999" not found for coach "${COACH_EMAIL}"`,
      statusCode: 404
    })
  })

  appTest('returns an explicit server error when coach settings are missing', async ({ app }) => {
    await app.db.insert(coaches).values(MISSING_SETTINGS_COACH)

    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: MISSING_SETTINGS_COACH.email },
      method: 'GET',
      url: '/v1/roster/me'
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
