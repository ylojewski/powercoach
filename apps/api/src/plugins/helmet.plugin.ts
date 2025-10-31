import helmet, { type FastifyHelmetOptions } from '@fastify/helmet'
import fastifyPlugin from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'

export const helmetPlugin: FastifyPluginAsync = fastifyPlugin(async (app) => {
  const helmetOptions: FastifyHelmetOptions = {
    crossOriginEmbedderPolicy: false
  }

  if (app.config.NODE_ENV !== 'production') {
    helmetOptions.contentSecurityPolicy = false
  }

  await app.register(helmet, helmetOptions)
})
