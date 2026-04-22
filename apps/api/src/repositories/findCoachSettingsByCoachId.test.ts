import { type FastifyInstance } from 'fastify'
import { type Mock } from 'vitest'

import { buildDummyApp } from '@/test/utils'

import { findCoachSettingsByCoachId } from './findCoachSettingsByCoachId'

function mockSettingsLookup(app: FastifyInstance, settings: Record<string, unknown>[]) {
  ;(app.db.select as unknown as Mock).mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue(settings)
      })
    })
  })
}

describe('findCoachSettingsByCoachId repository', () => {
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

  it('returns coach settings when they exist', async () => {
    mockSettingsLookup(dummyApp, [{ coachId: 10, defaultOrganizationId: 12 }])
    await expect(findCoachSettingsByCoachId(dummyApp.db, 10)).resolves.toStrictEqual({
      coachId: 10,
      defaultOrganizationId: 12
    })
  })

  it('returns null when coach settings do not exist', async () => {
    mockSettingsLookup(dummyApp, [])
    await expect(findCoachSettingsByCoachId(dummyApp.db, 10)).resolves.toBeNull()
  })
})
