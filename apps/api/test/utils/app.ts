import Fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify'
import type { AppConfig } from '@/core'
import { AppFastifyInstance, buildApp } from '@/app'
import { LOG_LEVEL, NODE_ENV } from '@/types/env.d'

type FastifySpy = {
  [K in keyof FastifyInstance]: FastifyInstance[K] extends (...args: infer _) => unknown ? K : never
}[keyof FastifyInstance]

export interface CreateEmptyAppOptions {
  plugins?: FastifyPluginAsync[]
  ready?: boolean
  spies?: FastifySpy[]
  withConfig?: boolean | NODE_ENV
}

export async function buildTestApp(): Promise<AppFastifyInstance> {
  const app = await buildApp({
    config: {
      HOST: '127.0.0.1',
      LOG_LEVEL: LOG_LEVEL.silent,
      NODE_ENV: NODE_ENV.development,
      PORT: 0
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
      HOST: '0.0.0.0',
      LOG_LEVEL: LOG_LEVEL.info,
      NODE_ENV: typeof withConfig === 'boolean' ? NODE_ENV.test : withConfig,
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
