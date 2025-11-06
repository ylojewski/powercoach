import { healthResponseSchema } from './schemas'
import { getHealthStatus } from './service'
import type { FastifyInstance } from 'fastify'

export function registerHealthRoutes(app: FastifyInstance) {
  app.route({
    handler: () => getHealthStatus(),
    method: 'GET',
    schema: {
      response: { 200: healthResponseSchema }
    },
    url: '/'
  })
}
