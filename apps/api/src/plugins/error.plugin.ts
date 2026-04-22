import { STATUS_CODES } from 'node:http'

import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { ApplicationError } from '@/src/errors'

export const ERROR_PLUGIN_NAME = 'powercoach.error.plugin' as const

function getHttpErrorLabel(statusCode: number): string {
  return STATUS_CODES[statusCode] ?? 'Error'
}

export const errorPluginCore: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ApplicationError) {
      return reply.status(error.statusCode).send({
        error: getHttpErrorLabel(error.statusCode),
        message: error.message,
        statusCode: error.statusCode
      })
    }

    return reply.send(error)
  })
}

export const errorPlugin = fastifyPlugin(errorPluginCore, {
  name: ERROR_PLUGIN_NAME
})
