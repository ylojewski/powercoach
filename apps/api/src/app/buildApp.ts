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
import { healthModule, rosterModule, settingsModule } from '@/src/modules'
import { errorPlugin, helmetPlugin, sensiblePlugin } from '@/src/plugins'

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

function resolveEnv(options: BuildAppOptions): Env {
  return options.env
    ? parseEnv(envSchema, options.env, ({ message }) => `Invalid environment: ${message}`)
    : loadEnv()
}

export function createBaseApp(env: Env): AppFastifyInstance {
  const loggerOptions = buildLoggerOptions({
    level: env.LOG_LEVEL,
    nodeEnv: env.NODE_ENV
  })
  const app = Fastify({
    ajv: { customOptions: ajvOptions },
    disableRequestLogging: true,
    genReqId: (request) => request.headers[REQUEST_ID_HEADER]?.toString() ?? randomUUID(),
    logger: loggerOptions,
    requestIdHeader: REQUEST_ID_HEADER,
    requestIdLogLabel: REQUEST_ID_LOG_LABEL
  }).withTypeProvider<TypeBoxTypeProvider>()

  app.decorate('env', env)

  app.addHook('onRequest', async (request, reply) => {
    reply.header(REQUEST_ID_HEADER, request.id)
  })

  return app
}

export async function registerCorePlugins(app: AppFastifyInstance): Promise<void> {
  await app.register(helmetPlugin)
  await app.register(sensiblePlugin)
  await app.register(errorPlugin)
}

export async function registerCoreModules(app: AppFastifyInstance): Promise<void> {
  await app.register(rosterModule, { prefix: '/v1/roster' })
  await app.register(settingsModule, { prefix: '/v1/settings' })
  await app.register(healthModule, { prefix: '/v1/health' })
}

export async function buildApp(options: BuildAppOptions = {}): Promise<AppFastifyInstance> {
  const env = resolveEnv(options)
  const { db, pg } = await createClient({ databaseUrl: env.DATABASE_URL })
  const app = createBaseApp(env)

  app.decorate('db', db)
  app.decorate('pg', pg)
  app.addHook('onClose', async () => {
    await pg.end()
  })

  await registerCorePlugins(app)
  await registerCoreModules(app)

  return app
}

declare module 'fastify' {
  interface FastifyInstance {
    db: NodePgDatabase
    env: Env
    pg: Client
  }
}
