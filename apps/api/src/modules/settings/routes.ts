import { type FastifyInstance } from 'fastify'

import { settingsResponseSchema } from './schemas'
import { getCurrentSettings } from './service'

export function registerSettingsRoutes(app: FastifyInstance, tag: string) {
  app.route({
    handler: getCurrentSettings,
    method: 'GET',
    schema: {
      operationId: 'getCurrentSettings',
      response: { 200: settingsResponseSchema },
      tags: [tag]
    },
    url: '/me'
  })
}
