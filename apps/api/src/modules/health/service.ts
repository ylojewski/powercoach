import { type RouteHandlerMethod } from 'fastify'

import { isDatabaseOk } from '@/src/repositories'

import { type HealthResponse } from './schemas'

export const getHealthStatus: RouteHandlerMethod = async (request): Promise<HealthResponse> => {
  return {
    database: await isDatabaseOk(request.server.db),
    live: true,
    ready: true,
    uptime: process.uptime()
  }
}
