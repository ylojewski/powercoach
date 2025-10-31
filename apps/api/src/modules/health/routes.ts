import { HEALTH_RESPONSE_SCHEMA_ID } from './schemas'
import { getHealthStatus } from './service'
import type { FastifyInstance } from 'fastify'

export function registerHealthRoutes(app: FastifyInstance) {
  app.route({
    handler: () => {
      return getHealthStatus()
    },
    method: 'GET',
    schema: {
      response: {
        200: { $ref: `${HEALTH_RESPONSE_SCHEMA_ID}#` }
      }
    },
    url: '/'
  })
}
