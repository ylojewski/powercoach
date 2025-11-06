import sensible from '@fastify/sensible'
import fastifyPlugin from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'

export const SENSIBLE_PLUGIN_NAME = 'powercoach.sensible.plugin' as const

export const sensiblePluginCore: FastifyPluginAsync = fastifyPlugin(async (app) => {
  await app.register(sensible)
})

export const sensiblePlugin = fastifyPlugin(sensiblePluginCore, {
  name: SENSIBLE_PLUGIN_NAME
})
