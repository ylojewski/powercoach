import { type FastifyInstance } from 'fastify'

import { coachContextResponseSchema } from './schemas'
import { getCurrentCoachContext } from './service'

export function registerCoachRoutes(app: FastifyInstance, tag: string) {
  app.route({
    handler: getCurrentCoachContext,
    method: 'GET',
    schema: {
      operationId: 'getCurrentCoachContext',
      response: { 200: coachContextResponseSchema },
      tags: [tag]
    },
    url: '/me'
  })
}
