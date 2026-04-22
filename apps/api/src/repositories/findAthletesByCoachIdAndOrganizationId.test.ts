import { type FastifyInstance } from 'fastify'
import { type Mock } from 'vitest'

import { buildDummyApp } from '@/test/utils'

import { findAthletesByCoachIdAndOrganizationId } from './findAthletesByCoachIdAndOrganizationId'

function mockAthletesLookup(app: FastifyInstance, athletes: Record<string, unknown>[]) {
  ;(app.db.select as unknown as Mock).mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue(athletes)
      })
    })
  })
}

describe('findAthletesByCoachIdAndOrganizationId repository', () => {
  let dummyApp: FastifyInstance

  beforeAll(async () => {
    dummyApp = await buildDummyApp({ withDb: true })
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    await dummyApp.close()
  })

  it('returns athletes for the coach and organization ordered by id', async () => {
    mockAthletesLookup(dummyApp, [
      {
        coachId: 10,
        email: 'kiro.flux@example.test',
        firstName: 'Kiro',
        id: 11,
        lastName: 'Flux',
        organizationId: 1,
        password: 'powercoach-demo'
      }
    ])

    await expect(findAthletesByCoachIdAndOrganizationId(dummyApp.db, 10, 1)).resolves.toStrictEqual(
      [
        {
          coachId: 10,
          email: 'kiro.flux@example.test',
          firstName: 'Kiro',
          id: 11,
          lastName: 'Flux',
          organizationId: 1,
          password: 'powercoach-demo'
        }
      ]
    )
  })

  it('returns an empty list when no athlete matches the couple', async () => {
    mockAthletesLookup(dummyApp, [])

    await expect(findAthletesByCoachIdAndOrganizationId(dummyApp.db, 10, 1)).resolves.toStrictEqual(
      []
    )
  })
})
