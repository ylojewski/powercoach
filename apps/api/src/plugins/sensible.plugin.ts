import sensible from '@fastify/sensible'
import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

export const SENSIBLE_PLUGIN_NAME = 'powercoach.sensible.plugin' as const

export const sensiblePluginCore: FastifyPluginAsync = fastifyPlugin(async (app) => {
  await app.register(sensible)
})

export const sensiblePlugin = fastifyPlugin(sensiblePluginCore, {
  name: SENSIBLE_PLUGIN_NAME
})
