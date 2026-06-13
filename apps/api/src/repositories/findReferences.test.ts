import { appTest } from '@/test/utils'

import { type ReferenceRows, findReferences } from './findReferences'

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
] as const satisfies readonly (keyof ReferenceRows)[]

function expectOrderedById(records: { id: number }[]) {
  const ids = records.map(({ id }) => id)
  expect(ids).toStrictEqual([...ids].sort((left, right) => left - right))
}

describe('findReferences repository', () => {
  appTest('returns the seeded reference data in a stable order', async ({ app }) => {
    const references = await findReferences(app.db)

    REFERENCE_COLLECTIONS.forEach((collection) => {
      expect(references[collection].length).toBeGreaterThan(0)
    })

    expect(references.disciplines).toContainEqual(expect.objectContaining({ code: 'powerlifting' }))
    expect(references.exerciseRoles).toContainEqual(
      expect.objectContaining({ code: 'competition' })
    )
    expect(references.exercises).toContainEqual(expect.objectContaining({ code: 'low_bar_squat' }))
    expect(references.exercises).not.toContainEqual(
      expect.objectContaining({ code: 'competition_squat' })
    )
    expect(references.disciplineMovements).toContainEqual(
      expect.objectContaining({
        code: 'squat',
        description: 'The lower-body competition movement built around knee-dominant barbell strength.',
        name: 'Squat'
      })
    )
    expect(references.loadingTypes).toContainEqual(
      expect.objectContaining({ code: 'external_load' })
    )
    expect(references.muscles).toContainEqual(expect.objectContaining({ code: 'glutes' }))
    expect(references.patterns).toContainEqual(expect.objectContaining({ code: 'squat' }))

    expectOrderedById(references.disciplines)
    expectOrderedById(references.exerciseRelationships)
    expectOrderedById(references.exerciseRoles)
    expectOrderedById(references.exercises)
    expectOrderedById(references.loadingTypes)
    expectOrderedById(references.muscleRoles)
    expectOrderedById(references.muscles)
    expectOrderedById(references.patterns)
  })
})
