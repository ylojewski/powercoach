import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { exerciseSchema } from '@/src/schemas'

export const SCHEMAS_PLUGIN_NAME = 'powercoach.schemas' as const

const schemasPluginCore: FastifyPluginAsync = async (app) => {
  app.addSchema(exerciseSchema)
}

export const schemasPlugin = fastifyPlugin(schemasPluginCore, {
  name: SCHEMAS_PLUGIN_NAME
})
