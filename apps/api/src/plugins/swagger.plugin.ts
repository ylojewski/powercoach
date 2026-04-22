import swagger from '@fastify/swagger'
import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { HEALTH_MODULE_TAG, ROSTER_MODULE_TAG, SETTINGS_MODULE_TAG } from '@/src/modules'

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
        { description: 'Roster endpoints', name: ROSTER_MODULE_TAG },
        { description: 'Coach settings endpoints', name: SETTINGS_MODULE_TAG },
        { description: 'Application health endpoints', name: HEALTH_MODULE_TAG }
      ]
    }
  })
}

export const swaggerPlugin = fastifyPlugin(swaggerPluginCore, {
  name: SWAGGER_PLUGIN_NAME
})
