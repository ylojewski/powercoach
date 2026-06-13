import { type ReferencesResponse } from '@/src/modules'
import { appTest } from '@/test/utils'

const REFERENCE_COLLECTIONS = [
  'disciplines',
  'disciplineMovements',
  'exerciseMuscles',
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
    const lowBarSquat = payload.exercises.find(({ code }) => code === 'low_bar_squat')

    if (!lowBarSquat) {
      throw new Error('Expected seeded exercise "low_bar_squat" to exist')
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
    expect(payload.disciplineMovements).toContainEqual(
      expect.objectContaining({
        code: 'squat',
        description: 'The lower-body competition movement built around knee-dominant barbell strength.',
        disciplineId: expect.any(Number),
        name: 'Squat',
        sortOrder: 1
      })
    )
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
    expect(payload.exerciseRelationships).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          defaultTransferCoefficient: expect.any(Number),
          disciplineId: expect.any(Number),
          roleId: expect.any(Number),
          sourceExerciseId: expect.any(Number),
          targetDisciplineMovementId: expect.any(Number)
        })
      ])
    )
    expect(lowBarSquat).toMatchObject({
      archivedAt: null,
      code: 'low_bar_squat',
      createdAt: expect.any(String),
      isSystem: true,
      isUnilateral: false,
      patternId: expect.any(Number),
      publicationStatus: 'published',
      title: 'Low bar squat',
      updatedAt: expect.any(String)
    })
    expect(payload.exercises).not.toContainEqual(
      expect.objectContaining({ code: 'competition_squat' })
    )
    expect(lowBarSquat).not.toHaveProperty('muscles')
    expect(lowBarSquat).not.toHaveProperty('patterns')
    expect(lowBarSquat).not.toHaveProperty('relationships')
  })
})
