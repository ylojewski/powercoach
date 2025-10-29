import sensible from '@fastify/sensible'
import type { FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

export const sensiblePlugin: FastifyPluginAsync = fastifyPlugin(async (app) => {
  await app.register(sensible)
})
