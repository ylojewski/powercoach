import { type FastifyInstance } from 'fastify'

import { healthResponseSchema } from './schemas'
import { getHealthStatus } from './service'

export function registerHealthRoutes(app: FastifyInstance, tag: string) {
  app.route({
    handler: getHealthStatus,
    method: 'GET',
    schema: {
      operationId: 'getHealthStatus',
      response: { 200: healthResponseSchema },
      tags: [tag]
    },
    url: '/'
  })
}
