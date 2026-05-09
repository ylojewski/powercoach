import { type ReferencesResponse } from '@/src/modules'
import { appTest } from '@/test/utils'

const REFERENCE_COLLECTIONS = [
  'disciplines',
  'exerciseMuscles',
  'exercisePatterns',
  'exerciseRelationships',
  'exerciseRoles',
  'exercises',
  'loadingTypes',
  'muscleRoles',
  'muscles',
  'patterns'
] as const satisfies readonly (keyof ReferencesResponse)[]

describe('GET /v1/references references route', () => {
  appTest('returns the seeded flat reference tables', async ({ app }) => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/references'
    })
    const payload = response.json<ReferencesResponse>()
    const competitionSquat = payload.exercises.find(({ code }) => code === 'competition_squat')

    if (!competitionSquat) {
      throw new Error('Expected seeded exercise "competition_squat" to exist')
    }

    expect(response.statusCode).toBe(200)
    REFERENCE_COLLECTIONS.forEach((collection) => {
      expect(payload[collection].length).toBeGreaterThan(0)
    })
    expect(payload.disciplines).toContainEqual(
      expect.objectContaining({
        code: 'powerlifting',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    )
    expect(payload.loadingTypes).toContainEqual(expect.objectContaining({ code: 'external_load' }))
    expect(payload.exerciseMuscles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          exerciseId: expect.any(Number),
          muscleId: expect.any(Number),
          muscleRoleId: expect.any(Number),
          weightPercentage: expect.any(Number)
        })
      ])
    )
    expect(payload.exercisePatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          exerciseId: expect.any(Number),
          patternId: expect.any(Number)
        })
      ])
    )
    expect(payload.exerciseRelationships).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          defaultTransferCoefficient: expect.any(Number),
          disciplineId: expect.any(Number),
          roleId: expect.any(Number),
          sourceExerciseId: expect.any(Number),
          targetExerciseId: expect.any(Number)
        })
      ])
    )
    expect(competitionSquat).toMatchObject({
      archivedAt: null,
      code: 'competition_squat',
      createdAt: expect.any(String),
      isSystem: true,
      isUnilateral: false,
      publicationStatus: 'published',
      title: 'Competition squat',
      updatedAt: expect.any(String)
    })
    expect(competitionSquat).not.toHaveProperty('muscles')
    expect(competitionSquat).not.toHaveProperty('patterns')
    expect(competitionSquat).not.toHaveProperty('relationships')
  })
})
