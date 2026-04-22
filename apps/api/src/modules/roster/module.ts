import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { REQUEST_MODULE_NAME } from '@/src/app'
import { coachPlugin } from '@/src/plugins'

import { registerRosterRoutes } from './routes'
import { athleteSchema, coachSchema, organizationSchema, rosterResponseSchema } from './schemas'

export const ROSTER_MODULE_NAME = 'powercoach.roster.module' as const
export const ROSTER_MODULE_TAG = 'roster' as const

export const rosterModuleCore: FastifyPluginAsync = async (app) => {
  await app.register(coachPlugin)
  app.addSchema(coachSchema)
  app.addSchema(organizationSchema)
  app.addSchema(athleteSchema)
  app.addSchema(rosterResponseSchema)
  app.addHook('onRequest', async (_, reply) => {
    reply.header(REQUEST_MODULE_NAME, ROSTER_MODULE_NAME)
  })
  registerRosterRoutes(app, ROSTER_MODULE_TAG)
}

export const rosterModule = fastifyPlugin(rosterModuleCore, {
  encapsulate: true,
  name: ROSTER_MODULE_NAME
})
