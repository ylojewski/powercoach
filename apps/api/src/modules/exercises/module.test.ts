import { type FastifyInstance } from 'fastify'
import { type MockedFunction } from 'vitest'

import { REQUEST_MODULE_NAME } from '@/src/app'
import { schemasPlugin } from '@/src/plugins'
import { buildDummyApp } from '@/test/utils'

import {
  EXERCISES_MODULE_NAME,
  EXERCISES_MODULE_TAG,
  exercisesModule,
  exercisesModuleCore
} from './module'
import {
  exerciseCodeQuerystringSchema,
  exerciseCodeResponseSchema,
  exerciseSchemas,
  type ExerciseCodeResponse
} from './schemas'
import * as service from './service'

const exerciseCodeResponse = {
  code: 'competition_squat',
  exercise: {
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
} satisfies ExerciseCodeResponse

describe('exercisesModule', () => {
  it('exposes a custom name and tags', () => {
    expect(EXERCISES_MODULE_NAME).toBe('powercoach.exercises.module')
    expect(EXERCISES_MODULE_TAG).toBe('exercises')
  })

  it('does not register scoped authentication', async () => {
    const app = await buildDummyApp({
      ready: false,
      spies: ['register']
    })

    await exercisesModuleCore(app, {})

    expect(app.register).not.toHaveBeenCalled()
    await app.close()
  })

  describe('runtime wiring', () => {
    let dummyApp: FastifyInstance
    let getExerciseCodeMock: MockedFunction<typeof service.getExerciseCode>

    beforeAll(async () => {
      getExerciseCodeMock = vi.spyOn(service, 'getExerciseCode')
      dummyApp = await buildDummyApp({
        plugins: [schemasPlugin, exercisesModule],
        spies: ['addSchema', 'route'],
        withDb: true
      })
    })

    afterAll(async () => {
      vi.resetAllMocks()
      await dummyApp.close()
    })

    it('registers the exercise schemas and GET /code route wiring', () => {
      expect(dummyApp.addSchema).toHaveBeenCalledTimes(exerciseSchemas.length + 1)
      exerciseSchemas.forEach((schema) => {
        expect(dummyApp.addSchema).toHaveBeenCalledWith(schema)
      })
      expect(dummyApp.route).toHaveBeenCalledTimes(1)
      expect(dummyApp.route).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          schema: expect.objectContaining({
            operationId: 'getExerciseCode',
            querystring: expect.objectContaining(exerciseCodeQuerystringSchema),
            response: expect.objectContaining({
              200: expect.objectContaining(exerciseCodeResponseSchema)
            }),
            tags: [EXERCISES_MODULE_TAG]
          }),
          url: '/code'
        })
      )
    })

    it('sets the module header and delegates GET /code to the service', async () => {
      getExerciseCodeMock.mockResolvedValueOnce(exerciseCodeResponse)

      const response = await dummyApp.inject({
        method: 'GET',
        url: '/code?title=Competition%20squat'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers[REQUEST_MODULE_NAME]).toBe(EXERCISES_MODULE_NAME)
      expect(service.getExerciseCode).toHaveBeenCalledTimes(1)
      expect(response.json()).toStrictEqual<ExerciseCodeResponse>(exerciseCodeResponse)
    })
  })
})
