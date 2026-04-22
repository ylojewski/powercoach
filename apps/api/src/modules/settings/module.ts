import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { REQUEST_MODULE_NAME } from '@/src/app'
import { coachPlugin } from '@/src/plugins'

import { registerSettingsRoutes } from './routes'
import { settingsResponseSchema } from './schemas'

export const SETTINGS_MODULE_NAME = 'powercoach.settings.module' as const
export const SETTINGS_MODULE_TAG = 'settings' as const

export const settingsModuleCore: FastifyPluginAsync = async (app) => {
  await app.register(coachPlugin)
  app.addSchema(settingsResponseSchema)
  app.addHook('onRequest', async (_, reply) => {
    reply.header(REQUEST_MODULE_NAME, SETTINGS_MODULE_NAME)
  })
  registerSettingsRoutes(app, SETTINGS_MODULE_TAG)
}

export const settingsModule = fastifyPlugin(settingsModuleCore, {
  encapsulate: true,
  name: SETTINGS_MODULE_NAME
})
