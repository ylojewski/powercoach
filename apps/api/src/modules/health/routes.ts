import type { FastifyInstance } from 'fastify'

import { HEALTH_RESPONSE_SCHEMA_ID } from './schemas'
import { getHealthStatus } from './service'

export async function registerHealthRoutes(app: FastifyInstance) {
  await app.route({
    handler: async () => {
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
