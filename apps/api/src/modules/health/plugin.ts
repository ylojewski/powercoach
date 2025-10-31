import { registerHealthRoutes } from './routes'
import { healthResponseSchema } from './schemas'
import type { FastifyPluginAsync } from 'fastify'

export const healthModule: FastifyPluginAsync = async (app) => {
  app.addSchema(healthResponseSchema)
  registerHealthRoutes(app)
}
