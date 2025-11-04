import Fastify, { FastifyInstance } from 'fastify'
import type { AppConfig } from '@/core'
import { LOG_LEVEL, NODE_ENV } from '@/types/env.d'

export interface CreateEmptyAppOptions {
  withConfig?: boolean | NODE_ENV
}

export function createEmptyApp({ withConfig }: CreateEmptyAppOptions): FastifyInstance {
  const app = Fastify()

  if (withConfig) {
    app.decorate('config', {
      HOST: '0.0.0.0',
      LOG_LEVEL: LOG_LEVEL.info,
      NODE_ENV: typeof withConfig === 'boolean' ? NODE_ENV.development : withConfig,
      PORT: 3000
    } as AppConfig)
  }

  return app
}
