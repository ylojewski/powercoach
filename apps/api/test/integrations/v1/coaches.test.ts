import { type CoachContextResponse, COACH_EMAIL_HEADER } from '@/src/modules'
import { appTest } from '@/test/utils'

const SEEDED_COACH_EMAIL = 'astra.quill@example.test' as const

describe('/v1/coaches/me', () => {
  appTest('returns the seeded coach context', async ({ app }) => {
    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: SEEDED_COACH_EMAIL },
      method: 'GET',
      url: '/v1/coaches/me'
    })
    const payload = response.json<CoachContextResponse>()

    expect(response.statusCode).toBe(200)
    expect(payload).toStrictEqual<CoachContextResponse>({
      athletes: [
        {
          email: 'kiro.flux@example.test',
          firstName: 'Kiro',
          id: expect.any(Number),
          lastName: 'Flux'
        },
        {
          email: 'nexa.vale@example.test',
          firstName: 'Nexa',
          id: expect.any(Number),
          lastName: 'Vale'
        },
        {
          email: 'tomo.pixel@example.test',
          firstName: 'Tomo',
          id: expect.any(Number),
          lastName: 'Pixel'
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
        }
      ]
    })
    expect(payload.coach).not.toHaveProperty('password')
    payload.athletes.forEach((athlete) => {
      expect(athlete).not.toHaveProperty('password')
    })
  })

  appTest('returns a bad request when the coach email header is missing', async ({ app }) => {
    const response = await app.inject({ method: 'GET', url: '/v1/coaches/me' })
    const payload = response.json()

    expect(response.statusCode).toBe(400)
    expect(payload).toMatchObject({
      error: 'Bad Request',
      message: `Missing "${COACH_EMAIL_HEADER}" header`,
      statusCode: 400
    })
  })

  appTest('returns not found when the coach does not exist', async ({ app }) => {
    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: 'ghost.coach@example.test' },
      method: 'GET',
      url: '/v1/coaches/me'
    })
    const payload = response.json()

    expect(response.statusCode).toBe(404)
    expect(payload).toMatchObject({
      error: 'Not Found',
      message: 'Coach "ghost.coach@example.test" not found',
      statusCode: 404
    })
  })
})
