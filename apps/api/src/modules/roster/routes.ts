import { type FastifyInstance } from 'fastify'

import { rosterQuerystringSchema, rosterResponseSchema } from './schemas'
import { getCurrentRoster } from './service'

export function registerRosterRoutes(app: FastifyInstance, tag: string) {
  app.route({
    handler: getCurrentRoster,
    method: 'GET',
    schema: {
      operationId: 'getCurrentRoster',
      querystring: rosterQuerystringSchema,
      response: { 200: rosterResponseSchema },
      tags: [tag]
    },
    url: '/me'
  })
}
