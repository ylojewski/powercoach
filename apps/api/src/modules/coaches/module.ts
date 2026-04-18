import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { REQUEST_MODULE_NAME } from '@/src/app'

import { registerCoachRoutes } from './routes'
import {
  athleteSummarySchema,
  coachContextResponseSchema,
  coachSummarySchema,
  organizationSummarySchema
} from './schemas'

export const COACHES_MODULE_NAME = 'powercoach.coaches.module' as const
export const COACHES_MODULE_TAG = 'coaches' as const

export const coachesModuleCore: FastifyPluginAsync = async (app) => {
  app.addSchema(coachSummarySchema)
  app.addSchema(organizationSummarySchema)
  app.addSchema(athleteSummarySchema)
  app.addSchema(coachContextResponseSchema)
  app.addHook('onRequest', async (_, reply) => {
    reply.header(REQUEST_MODULE_NAME, COACHES_MODULE_NAME)
  })
  registerCoachRoutes(app, COACHES_MODULE_TAG)
}

export const coachesModule = fastifyPlugin(coachesModuleCore, {
  encapsulate: true,
  name: COACHES_MODULE_NAME
})
