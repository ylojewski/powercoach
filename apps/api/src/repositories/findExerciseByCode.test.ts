import { appTest } from '@/test/utils'

import { findExerciseByCode } from './findExerciseByCode'

describe('findExerciseByCode repository', () => {
  appTest('returns an exercise by code', async ({ app }) => {
    const exercise = await findExerciseByCode(app.db, 'low_bar_squat')

    expect(exercise).toMatchObject({
      code: 'low_bar_squat',
      title: 'Low bar squat'
    })
  })

  appTest('returns null when no exercise matches the code', async ({ app }) => {
    const exercise = await findExerciseByCode(app.db, 'not_existing')

    expect(exercise).toBeNull()
  })
})
