import { type FastifyInstance } from 'fastify'

import { userResponseSchema } from './schemas'
import { getUserProfile } from './service'

export function registerUserRoutes(app: FastifyInstance) {
  app.route({
    handler: async () => getUserProfile(),
    method: 'GET',
    schema: {
      response: { 200: userResponseSchema }
    },
    url: '/'
  })
}
