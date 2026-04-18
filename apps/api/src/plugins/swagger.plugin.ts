import swagger from '@fastify/swagger'
import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { COACHES_MODULE_TAG, HEALTH_MODULE_TAG } from '@/src/modules'

const version = process.env.npm_package_version

if (!version) {
  throw new Error('Missing process.env.npm_package_version')
}

export const SWAGGER_PLUGIN_NAME = 'powercoach.swagger.plugin' as const

export const swaggerPluginCore: FastifyPluginAsync = async (app) => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Powercoach API',
        version
      },
      tags: [
        { description: 'Coach roster and context endpoints', name: COACHES_MODULE_TAG },
        { description: 'Application health endpoints', name: HEALTH_MODULE_TAG }
      ]
    }
  })
}

export const swaggerPlugin = fastifyPlugin(swaggerPluginCore, {
  name: SWAGGER_PLUGIN_NAME
})
