import { Options } from '@fastify/ajv-compiler'
import Fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify'

import { AppFastifyInstance, buildApp } from '@/src/app'
import { type AppConfig } from '@/src/core'
import { LogLevel, NodeEnv } from '@/src/types'

type FastifySpy = {
  [K in keyof FastifyInstance]: FastifyInstance[K] extends (...args: infer _) => unknown ? K : never
}[keyof FastifyInstance]

export interface CreateEmptyAppOptions {
  plugins?: FastifyPluginAsync[]
  ready?: boolean
  spies?: FastifySpy[]
  withConfig?: boolean | NodeEnv
}

export async function buildTestApp(): Promise<AppFastifyInstance> {
  const app = await buildApp({
    config: {
      DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/powercoach',
      HOST: '127.0.0.1',
      LOG_LEVEL: LogLevel.silent,
      NODE_ENV: NodeEnv.development,
      PORT: 1
    }
  })

  await app.ready()
  return app
}

export async function buildDummyApp(options?: CreateEmptyAppOptions): Promise<FastifyInstance> {
  const { plugins = [], ready = true, spies = [], withConfig } = options ?? {}
  const app = Fastify()

  if (spies) {
    spies.forEach((spy) => {
      vi.spyOn(app, spy)
    })
  }

  if (withConfig) {
    app.decorate('config', {
      DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/powercoach',
      HOST: '0.0.0.0',
      LOG_LEVEL: LogLevel.info,
      NODE_ENV: typeof withConfig === 'boolean' ? NodeEnv.test : withConfig,
      PORT: 3000
    } as AppConfig)
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
