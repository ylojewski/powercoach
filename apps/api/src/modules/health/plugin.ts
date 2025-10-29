import type { FastifyPluginAsync } from 'fastify'

import { registerHealthRoutes } from './routes'
import { healthResponseSchema } from './schemas'

export const healthModule: FastifyPluginAsync = async (app) => {
  app.addSchema(healthResponseSchema)
  await registerHealthRoutes(app)
}
