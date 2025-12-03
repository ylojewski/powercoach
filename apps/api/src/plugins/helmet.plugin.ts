import helmet, { type FastifyHelmetOptions } from '@fastify/helmet'
import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

export const HELMET_PLUGIN_NAME = 'powercoach.helmet.plugin' as const

export const helmetPluginCore: FastifyPluginAsync = async (app) => {
  const helmetOptions: FastifyHelmetOptions = {
    crossOriginEmbedderPolicy: false
  }

  if (app.env.NODE_ENV !== 'production') {
    helmetOptions.contentSecurityPolicy = false
  }

  await app.register(helmet, helmetOptions)
}

export const helmetPlugin = fastifyPlugin(helmetPluginCore, {
  name: HELMET_PLUGIN_NAME
})
