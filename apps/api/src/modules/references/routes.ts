import { type FastifyInstance } from 'fastify'

import { referencesResponseSchema } from './schemas'
import { getReferences } from './service'

export function registerReferencesRoutes(app: FastifyInstance, tag: string) {
  app.route({
    handler: getReferences,
    method: 'GET',
    schema: {
      operationId: 'getReferences',
      response: { 200: referencesResponseSchema },
      tags: [tag]
    },
    url: '/'
  })
}
