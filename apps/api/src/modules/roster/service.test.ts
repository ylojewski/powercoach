import { InvalidCoachSettingsError } from '@/src/errors'

import { getCurrentRoster } from './service'

function createLimitChain(value: unknown) {
  return {
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue(value)
      })
    })
  }
}

function createOrganizationsChain(value: unknown) {
  return {
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue(value)
      })
    })
  }
}

describe('getCurrentRoster', () => {
  it('returns an explicit server error when the default organization is inconsistent', async () => {
    const selectMock = vi.fn()
    selectMock
      .mockReturnValueOnce(createLimitChain([{ coachId: 10, defaultOrganizationId: 999 }]))
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({})
        })
      })
      .mockReturnValueOnce(createOrganizationsChain([{ id: 1, name: 'Orbit Foundry' }]))

    const request = {
      coach: {
        email: 'astra.quill@example.test',
        firstName: 'Astra',
        id: 10,
        lastName: 'Quill',
        password: 'powercoach-demo'
      },
      query: {},
      server: {
        db: {
          select: selectMock
        },
        httpErrors: {
          notFound: vi.fn()
        }
      }
    } as unknown as Parameters<typeof getCurrentRoster>[0]

    await expect(getCurrentRoster(request)).rejects.toThrowError(InvalidCoachSettingsError)
    expect(selectMock).toHaveBeenCalledTimes(3)
  })
})
