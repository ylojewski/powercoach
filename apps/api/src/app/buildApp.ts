import { randomUUID } from 'node:crypto'

import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'

import { buildLogger, loadConfig, type AppConfig } from '../core'
import { healthModule } from '../modules'
import { sensiblePlugin } from '../plugins'

export interface BuildAppOptions {
  config?: AppConfig
}

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const config = options.config ?? loadConfig()
  const logger = buildLogger({ level: config.LOG_LEVEL, nodeEnv: config.NODE_ENV })

  const app = Fastify({
    logger,
    disableRequestLogging: true,
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'reqId',
    genReqId: (request) => request.headers['x-request-id']?.toString() ?? randomUUID(),
    ajv: {
      customOptions: {
        removeAdditional: 'all',
        coerceTypes: false
      }
    }
  }).withTypeProvider<TypeBoxTypeProvider>()

  app.decorate('config', config)

  app.addHook('onRequest', async (request, reply) => {
    reply.header('x-request-id', request.id)
  })

  await app.register(sensiblePlugin)
  await app.register(healthModule, { prefix: '/v1/health' })

  return app
}

declare module 'fastify' {
  interface FastifyInstance {
    config: AppConfig
  }
}
