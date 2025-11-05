import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { buildLogger, loadConfig, parseConfig, type AppConfig } from '@src/core'
import { healthModule } from '@src/modules'
import { helmetPlugin, sensiblePlugin } from '@src/plugins'
import Fastify from 'fastify'
import { randomUUID } from 'node:crypto'
import type { FastifyInstance, RawServerDefault } from 'fastify'
import type { IncomingMessage, ServerResponse } from 'node:http'

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

export const REQUEST_ID_HEADER = 'x-request-id' as const

export async function buildApp(options: BuildAppOptions = {}): Promise<AppFastifyInstance> {
  const config = options.config
    ? parseConfig(options.config, ({ message }) => `Invalid configuration: ${message}`)
    : loadConfig()
  const logger = buildLogger({ level: config.LOG_LEVEL, nodeEnv: config.NODE_ENV })
  const app = Fastify({
    ajv: {
      customOptions: {
        coerceTypes: false,
        removeAdditional: 'all'
      }
    },
    disableRequestLogging: true,
    genReqId: (request) => request.headers[REQUEST_ID_HEADER]?.toString() ?? randomUUID(),
    loggerInstance: logger,
    requestIdHeader: REQUEST_ID_HEADER,
    requestIdLogLabel: 'reqId'
  }).withTypeProvider<TypeBoxTypeProvider>()

  app.decorate('config', config)
  app.addHook('onRequest', async (request, reply) => {
    reply.header(REQUEST_ID_HEADER, request.id)
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
