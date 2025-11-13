import { randomUUID } from 'node:crypto'
import { type IncomingMessage, type ServerResponse } from 'node:http'

import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import Fastify, {
  type FastifyBaseLogger,
  type FastifyInstance,
  type RawServerDefault
} from 'fastify'

import { type AppConfig, buildLoggerOptions, loadConfig, parseConfig } from '@/src/core'
import { healthModule } from '@/src/modules'
import { helmetPlugin, sensiblePlugin } from '@/src/plugins'

import { ajvOptions } from './ajvOptions'
import { REQUEST_ID_HEADER, REQUEST_ID_LOG_LABEL } from './constants'

export type AppFastifyInstance = FastifyInstance<
  RawServerDefault,
  IncomingMessage,
  ServerResponse,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>

export interface BuildAppOptions {
  config?: AppConfig
}

export async function buildApp(options: BuildAppOptions = {}): Promise<AppFastifyInstance> {
  const config = options.config
    ? parseConfig(options.config, ({ message }) => `Invalid config: ${message}`)
    : loadConfig()
  const loggerOptions = buildLoggerOptions({
    level: config.LOG_LEVEL,
    nodeEnv: config.NODE_ENV
  })
  const app = Fastify({
    ajv: { customOptions: ajvOptions },
    disableRequestLogging: true,
    genReqId: (request) => request.headers[REQUEST_ID_HEADER]?.toString() ?? randomUUID(),
    logger: loggerOptions,
    requestIdHeader: REQUEST_ID_HEADER,
    requestIdLogLabel: REQUEST_ID_LOG_LABEL
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
