import { type Options } from '@fastify/ajv-compiler'
import { NodeEnv } from '@powercoach/util-env'
import { type NodePgDatabase } from 'drizzle-orm/node-postgres'
import Fastify, { type FastifyInstance, type FastifyPluginAsync } from 'fastify'

import { type AppFastifyInstance, buildApp } from '@/src/app'
import { type Env } from '@/src/core'
import { createRealEnv, testEnv } from '@/test/fixtures'

type FastifySpy = {
  [K in keyof FastifyInstance]: FastifyInstance[K] extends (...args: infer _) => unknown ? K : never
}[keyof FastifyInstance]

export interface CreateEmptyAppOptions {
  plugins?: FastifyPluginAsync[]
  ready?: boolean
  spies?: FastifySpy[]
  withDb?: boolean
  withEnv?: boolean | NodeEnv
}

export async function buildDummyApp(options?: CreateEmptyAppOptions): Promise<FastifyInstance> {
  const { plugins = [], ready = true, spies = [], withDb, withEnv } = options ?? {}
  const app = Fastify()

  if (spies) {
    spies.forEach((spy) => {
      vi.spyOn(app, spy)
    })
  }

  if (withEnv) {
    const env: Env = {
      ...testEnv,
      NODE_ENV: typeof withEnv === 'boolean' ? NodeEnv.test : withEnv
    }
    app.decorate('env', env)
  }

  if (withDb) {
    app.decorate('db', {
      delete: vi.fn(),
      execute: vi.fn(),
      insert: vi.fn(),
      select: vi.fn(),
      update: vi.fn()
    } as unknown as NodePgDatabase)
  }

  if (plugins) {
    plugins.forEach((plugin) => {
      app.register(plugin)
    })
  }

  if (ready) {
    await app.ready()
  }

  return app
}

export function getAjvOptions(app: AppFastifyInstance): Options | undefined {
  const symbols = Object.getOwnPropertySymbols(app)
  const optionsSymbol = symbols.find((symbol) => symbol.toString() === 'Symbol(fastify.options)')

  if (optionsSymbol) {
    // @ts-expect-error Symbol(fastify.options) exists on fastify@5.6.1
    return app[optionsSymbol].ajv.customOptions
  }
}

export const appTest = test.extend<{ app: AppFastifyInstance }>({
  app: async ({}, use) => {
    const env = createRealEnv()
    const app = await buildApp({ env })
    await app.ready()
    await use(app)
    await app.close()
  }
})
