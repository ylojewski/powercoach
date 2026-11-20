import { type RouteHandlerMethod } from 'fastify'

import { findReferences } from '@/src/repositories'

import { type ReferencesResponse } from './schemas'

export const getReferences: RouteHandlerMethod = async (request): Promise<ReferencesResponse> => {
  return findReferences(request.server.db)
}
