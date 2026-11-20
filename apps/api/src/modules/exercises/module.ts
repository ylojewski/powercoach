import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { REQUEST_MODULE_NAME } from '@/src/app'

import { registerExercisesRoutes } from './routes'
import { exerciseSchemas } from './schemas'

export const EXERCISES_MODULE_NAME = 'powercoach.exercises.module' as const
export const EXERCISES_MODULE_TAG = 'exercises' as const

export const exercisesModuleCore: FastifyPluginAsync = async (app) => {
  exerciseSchemas.forEach((schema) => {
    app.addSchema(schema)
  })
  app.addHook('onRequest', async (_, reply) => {
    reply.header(REQUEST_MODULE_NAME, EXERCISES_MODULE_NAME)
  })
  registerExercisesRoutes(app, EXERCISES_MODULE_TAG)
}

export const exercisesModule = fastifyPlugin(exercisesModuleCore, {
  encapsulate: true,
  name: EXERCISES_MODULE_NAME
})
