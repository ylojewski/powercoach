import { type FastifyInstance } from 'fastify'
import { type Mock } from 'vitest'

import { buildDummyApp } from '@/test/utils'

import { findCoachOrganizationsByCoachId } from './findCoachOrganizationsByCoachId'

function mockCoachOrganizationsLookup(
  app: FastifyInstance,
  organizations: Record<string, unknown>[]
) {
  ;(app.db.select as unknown as Mock)
    .mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({})
      })
    })
    .mockReturnValueOnce({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(organizations)
        })
      })
    })
}

describe('findCoachOrganizationsByCoachId repository', () => {
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

  it('returns the coach organizations ordered by id', async () => {
    mockCoachOrganizationsLookup(dummyApp, [
      { id: 1, name: 'Orbit Foundry' },
      { id: 2, name: 'Nova Athletics' }
    ])

    await expect(findCoachOrganizationsByCoachId(dummyApp.db, 10)).resolves.toStrictEqual([
      { id: 1, name: 'Orbit Foundry' },
      { id: 2, name: 'Nova Athletics' }
    ])
  })

  it('returns an empty list when the coach has no organizations', async () => {
    mockCoachOrganizationsLookup(dummyApp, [])

    await expect(findCoachOrganizationsByCoachId(dummyApp.db, 10)).resolves.toStrictEqual([])
  })
})
