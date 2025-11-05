import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import Fastify from 'fastify'
import { randomUUID } from 'node:crypto'
import type { FastifyInstance, RawServerDefault } from 'fastify'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { buildLogger, loadConfig, type AppConfig } from '@/core'
import { healthModule } from '@/modules'
import { helmetPlugin, sensiblePlugin } from '@/plugins'

export type AppFastifyInstance = FastifyInstance<
  RawServerDefault,
  IncomingMessage,
  ServerResponse,
  ReturnType<typeof buildLogger>,
  TypeBoxTypeProvider
>

export interface BuildAppOptions {
  config?: AppConfig
}

export async function buildApp(options: BuildAppOptions = {}): Promise<AppFastifyInstance> {
  const config = options.config ?? loadConfig()
  const logger = buildLogger({ level: config.LOG_LEVEL, nodeEnv: config.NODE_ENV })

  const app = Fastify({
    ajv: {
      customOptions: {
        coerceTypes: false,
        removeAdditional: 'all'
      }
    },
    disableRequestLogging: true,
    genReqId: (request) => request.headers['x-request-id']?.toString() ?? randomUUID(),
    loggerInstance: logger,
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'reqId'
  }).withTypeProvider<TypeBoxTypeProvider>()

  app.decorate('config', config)

  app.addHook('onRequest', async (request, reply) => {
    reply.header('x-request-id', request.id)
  })

  await app.register(helmetPlugin)
  await app.register(sensiblePlugin)
  await app.register(healthModule, { prefix: '/v1/health' })

  return app
}

declare module 'fastify' {
  interface FastifyInstance {
    config: AppConfig
  }
}
