import { type RouteHandlerMethod } from 'fastify'

import { isOkQuery } from '@/src/repositories'

import { type HealthResponse } from './schemas'

export const getHealthStatus: RouteHandlerMethod = async (request): Promise<HealthResponse> => {
  return {
    database: await isOkQuery(request.server),
    live: true,
    ready: true,
    uptime: process.uptime()
  }
}
