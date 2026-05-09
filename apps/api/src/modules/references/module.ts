import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { REQUEST_MODULE_NAME } from '@/src/app'

import { registerReferencesRoutes } from './routes'
import { referenceSchemas } from './schemas'

export const REFERENCES_MODULE_NAME = 'powercoach.references.module' as const
export const REFERENCES_MODULE_TAG = 'references' as const

export const referencesModuleCore: FastifyPluginAsync = async (app) => {
  referenceSchemas.forEach((schema) => {
    app.addSchema(schema)
  })
  app.addHook('onRequest', async (_, reply) => {
    reply.header(REQUEST_MODULE_NAME, REFERENCES_MODULE_NAME)
  })
  registerReferencesRoutes(app, REFERENCES_MODULE_TAG)
}

export const referencesModule = fastifyPlugin(referencesModuleCore, {
  encapsulate: true,
  name: REFERENCES_MODULE_NAME
})
