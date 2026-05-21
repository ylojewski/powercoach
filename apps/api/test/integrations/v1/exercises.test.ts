import { type ExerciseCodeResponse } from '@/src/modules'
import { appTest } from '@/test/utils'

describe('GET /v1/exercises/code exercises route', () => {
  appTest(
    'returns the generated code and matching exercise when the code exists',
    async ({ app }) => {
      const response = await app.inject({
        method: 'GET',
        url: '/v1/exercises/code?title=Competition%20squat'
      })
      const payload = response.json<ExerciseCodeResponse>()

      expect(response.statusCode).toBe(200)
      expect(payload).toMatchObject({
        code: 'competition_squat',
        exercise: {
          archivedAt: null,
          code: 'competition_squat',
          id: expect.any(Number),
          isSystem: true,
          publicationStatus: 'published',
          title: 'Competition squat'
        }
      })
      expect(payload.exercise?.createdAt).toEqual(expect.any(String))
      expect(payload.exercise?.updatedAt).toEqual(expect.any(String))
    }
  )

  appTest(
    'returns the generated code and no exercise when the code is available',
    async ({ app }) => {
      const response = await app.inject({
        method: 'GET',
        url: '/v1/exercises/code?title=Paused%20competition%20squat'
      })
      const payload = response.json<ExerciseCodeResponse>()

      expect(response.statusCode).toBe(200)
      expect(payload).toStrictEqual<ExerciseCodeResponse>({
        code: 'paused_competition_squat',
        exercise: null
      })
    }
  )

  appTest('rejects requests without a title', async ({ app }) => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/exercises/code'
    })

    expect(response.statusCode).toBe(400)
  })
})
