import sensible from '@fastify/sensible'
import fastifyPlugin from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'

export const sensiblePlugin: FastifyPluginAsync = fastifyPlugin(async (app) => {
  await app.register(sensible)
})
