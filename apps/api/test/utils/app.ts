import Fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify'
import type { AppConfig } from '@/core'
import { AppFastifyInstance, buildApp } from '@/app'
import { LogLevel, NodeEnv } from '@/types'

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
