import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { REQUEST_MODULE_NAME } from '@/src/app'

import { registerUserRoutes } from './routes'
import { userResponseSchema } from './schemas'

export const USER_MODULE_NAME = 'powercoach.user.module' as const

export const userModuleCore: FastifyPluginAsync = async (app) => {
  app.addSchema(userResponseSchema)
  app.addHook('onRequest', async (_, reply) => {
    reply.header(REQUEST_MODULE_NAME, USER_MODULE_NAME)
  })
  registerUserRoutes(app)
}

export const userModule = fastifyPlugin(userModuleCore, {
  encapsulate: true,
  name: USER_MODULE_NAME
})
