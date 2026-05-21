import { appTest } from '@/test/utils'

import { findExerciseByCode } from './findExerciseByCode'

describe('findExerciseByCode repository', () => {
  appTest('returns an exercise by code', async ({ app }) => {
    const exercise = await findExerciseByCode(app.db, 'competition_squat')

    expect(exercise).toMatchObject({
      code: 'competition_squat',
      title: 'Competition squat'
    })
  })

  appTest('returns null when no exercise matches the code', async ({ app }) => {
    const exercise = await findExerciseByCode(app.db, 'not_existing')

    expect(exercise).toBeNull()
  })
})
