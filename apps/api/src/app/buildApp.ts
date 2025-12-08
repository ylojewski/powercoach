import { randomUUID } from 'node:crypto'
import { type IncomingMessage, type ServerResponse } from 'node:http'

import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { createClient } from '@powercoach/db'
import { parseEnv } from '@powercoach/util-env'
import { type NodePgDatabase } from 'drizzle-orm/node-postgres'
import Fastify, {
  type FastifyBaseLogger,
  type FastifyInstance,
  type RawServerDefault
} from 'fastify'
import { Client } from 'pg'

import { type Env, buildLoggerOptions, loadEnv, envSchema } from '@/src/core'
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
  env?: Env
}

export async function buildApp(options: BuildAppOptions = {}): Promise<AppFastifyInstance> {
  const env = options.env
    ? parseEnv(envSchema, options.env, ({ message }) => `Invalid environment: ${message}`)
    : loadEnv()
  const loggerOptions = buildLoggerOptions({
    level: env.LOG_LEVEL,
    nodeEnv: env.NODE_ENV
  })
  const { db, pg } = await createClient({ databaseUrl: env.DATABASE_URL })
  const app = Fastify({
    ajv: { customOptions: ajvOptions },
    disableRequestLogging: true,
    genReqId: (request) => request.headers[REQUEST_ID_HEADER]?.toString() ?? randomUUID(),
    logger: loggerOptions,
    requestIdHeader: REQUEST_ID_HEADER,
    requestIdLogLabel: REQUEST_ID_LOG_LABEL
  }).withTypeProvider<TypeBoxTypeProvider>()

  app.decorate('env', env)

  app.decorate('db', db)
  app.decorate('pg', pg)

  app.addHook('onRequest', async (request, reply) => {
    reply.header(REQUEST_ID_HEADER, request.id)
  })
  app.addHook('onClose', async () => {
    await pg.end()
  })

  await app.register(helmetPlugin)
  await app.register(sensiblePlugin)
  await app.register(healthModule, { prefix: '/v1/health' })

  return app
}

declare module 'fastify' {
  interface FastifyInstance {
    db: NodePgDatabase
    env: Env
    pg: Client
  }
}
