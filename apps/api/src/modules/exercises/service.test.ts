import { findExerciseByCode } from '@/src/repositories'
import { type Exercise } from '@/src/schemas'

import { type ExerciseCodeResponse } from './schemas'
import { getExerciseCode } from './service'

vi.mock('@/src/repositories', () => ({
  findExerciseByCode: vi.fn()
}))

const EXERCISE: Exercise = {
  archivedAt: null,
  bodyweightCoefficient: null,
  code: 'competition_squat',
  createdAt: '2024-01-01T00:00:00.000Z',
  descriptionMarkdown: null,
  id: 1,
  imageUrl: null,
  isSystem: true,
  isUnilateral: false,
  loadingTypeId: 1,
  patternId: 1,
  publicationStatus: 'published',
  shortInstructionsMarkdown: null,
  subtitle: null,
  title: 'Competition squat',
  updatedAt: '2024-01-01T00:00:00.000Z',
  videoUrl: null
}

describe('getExerciseCode', () => {
  const findExerciseByCodeMock = vi.mocked(findExerciseByCode)

  let db: object
  let request: Parameters<typeof getExerciseCode>[0]

  beforeEach(() => {
    vi.clearAllMocks()
    db = {}
    request = {
      query: { title: 'Competition squat' },
      server: { db }
    } as unknown as Parameters<typeof getExerciseCode>[0]
  })

  it('returns the generated code and matching exercise when one is found', async () => {
    findExerciseByCodeMock.mockResolvedValueOnce(EXERCISE)

    const result = await getExerciseCode(request)

    expect(findExerciseByCodeMock).toHaveBeenCalledWith(db, 'competition_squat')
    expect(result).toStrictEqual<ExerciseCodeResponse>({
      code: 'competition_squat',
      exercise: EXERCISE
    })
  })

  it('returns the generated code and null exercise when no match is found', async () => {
    findExerciseByCodeMock.mockResolvedValueOnce(null)

    const result = await getExerciseCode(request)

    expect(findExerciseByCodeMock).toHaveBeenCalledWith(db, 'competition_squat')
    expect(result).toStrictEqual<ExerciseCodeResponse>({
      code: 'competition_squat',
      exercise: null
    })
  })

  it('returns an empty code and null exercise when the title produces no code', async () => {
    request = { ...request, query: { title: '--' } } as unknown as Parameters<
      typeof getExerciseCode
    >[0]

    const result = await getExerciseCode(request)

    expect(findExerciseByCodeMock).not.toHaveBeenCalled()
    expect(result).toStrictEqual<ExerciseCodeResponse>({ code: '', exercise: null })
  })
})
