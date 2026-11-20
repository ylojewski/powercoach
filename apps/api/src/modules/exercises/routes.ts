import { type FastifyInstance } from 'fastify'

import { exerciseCodeQuerystringSchema, exerciseCodeResponseSchema } from './schemas'
import { getExerciseCode } from './service'

export function registerExercisesRoutes(app: FastifyInstance, tag: string) {
  app.route({
    handler: getExerciseCode,
    method: 'GET',
    schema: {
      operationId: 'getExerciseCode',
      querystring: exerciseCodeQuerystringSchema,
      response: { 200: exerciseCodeResponseSchema },
      tags: [tag]
    },
    url: '/code'
  })
}
