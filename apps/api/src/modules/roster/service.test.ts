import { COACH_ROW, DEFAULT_ORGANIZATION, SETTINGS_RESPONSE } from '@powercoach/util-fixture'

import { InvalidCoachSettingsError } from '@/src/errors'
import {
  findAthletesByCoachIdAndOrganizationId,
  findCoachOrganizationsByCoachId,
  findCoachSettingsByCoachId
} from '@/src/repositories'

import { getCurrentRoster } from './service'

vi.mock('@/src/repositories', () => ({
  findAthletesByCoachIdAndOrganizationId: vi.fn(),
  findCoachOrganizationsByCoachId: vi.fn(),
  findCoachSettingsByCoachId: vi.fn()
}))

describe('getCurrentRoster', () => {
  const findCoachSettingsByCoachIdMock = vi.mocked(findCoachSettingsByCoachId)
  const findCoachOrganizationsByCoachIdMock = vi.mocked(findCoachOrganizationsByCoachId)
  const findAthletesByCoachIdAndOrganizationIdMock = vi.mocked(
    findAthletesByCoachIdAndOrganizationId
  )
  const coachSettings = { coachId: 10, ...SETTINGS_RESPONSE } as const

  let db: object
  let notFoundMock: ReturnType<typeof vi.fn>
  let notFoundError: Error
  let request: Parameters<typeof getCurrentRoster>[0]

  beforeEach(() => {
    vi.clearAllMocks()
    db = {}
    notFoundError = new Error('not-found')
    notFoundMock = vi.fn().mockReturnValue(notFoundError)
    request = {
      coach: { ...COACH_ROW, id: 10 },
      query: {},
      server: { db, httpErrors: { notFound: notFoundMock } }
    } as unknown as Parameters<typeof getCurrentRoster>[0]
  })

  it('throws an explicit server error when the settings are missing', async () => {
    findCoachSettingsByCoachIdMock.mockResolvedValueOnce(null)
    findCoachOrganizationsByCoachIdMock.mockResolvedValueOnce([])

    await expect(getCurrentRoster(request)).rejects.toThrowError(InvalidCoachSettingsError)

    expect(findCoachSettingsByCoachIdMock).toHaveBeenCalledWith(db, 10)
    expect(findCoachOrganizationsByCoachIdMock).toHaveBeenCalledWith(db, 10)
    expect(findAthletesByCoachIdAndOrganizationIdMock).not.toHaveBeenCalled()
    expect(notFoundMock).not.toHaveBeenCalled()
  })

  it('throws an explicit server error when the default organization is inconsistent', async () => {
    findCoachSettingsByCoachIdMock.mockResolvedValueOnce(coachSettings)
    findCoachOrganizationsByCoachIdMock.mockResolvedValueOnce([
      { ...DEFAULT_ORGANIZATION, id: 999 }
    ])

    await expect(getCurrentRoster(request)).rejects.toThrowError(InvalidCoachSettingsError)

    expect(findCoachSettingsByCoachIdMock).toHaveBeenCalledWith(db, 10)
    expect(findCoachOrganizationsByCoachIdMock).toHaveBeenCalledWith(db, 10)
    expect(findAthletesByCoachIdAndOrganizationIdMock).not.toHaveBeenCalled()
    expect(notFoundMock).not.toHaveBeenCalled()
  })

  it('throws a notFound error when the given organization does not exist', async () => {
    request.query = {
      organizationId: '999'
    }

    findCoachSettingsByCoachIdMock.mockResolvedValueOnce(coachSettings)
    findCoachOrganizationsByCoachIdMock.mockResolvedValueOnce([{ ...DEFAULT_ORGANIZATION, id: 1 }])

    await expect(getCurrentRoster(request)).rejects.toBe(notFoundError)

    expect(findCoachSettingsByCoachIdMock).toHaveBeenCalledWith(db, 10)
    expect(findCoachOrganizationsByCoachIdMock).toHaveBeenCalledWith(db, 10)
    expect(notFoundMock).toHaveBeenCalledWith(
      `Organization "999" not found for coach "${COACH_ROW.email}"`
    )
    expect(findAthletesByCoachIdAndOrganizationIdMock).not.toHaveBeenCalled()
  })
})
