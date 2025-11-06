import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { REQUEST_MODULE_NAME } from '@/src/app'

import { registerHealthRoutes } from './routes'
import { healthResponseSchema } from './schemas'

export const HEALTH_MODULE_NAME = 'powercoach.health.module' as const

export const healthModuleCore: FastifyPluginAsync = async (app) => {
  app.addSchema(healthResponseSchema)
  app.addHook('onRequest', async (_, reply) => {
    reply.header(REQUEST_MODULE_NAME, HEALTH_MODULE_NAME)
  })
  registerHealthRoutes(app)
}

export const healthModule = fastifyPlugin(healthModuleCore, {
  encapsulate: true,
  name: HEALTH_MODULE_NAME
})
