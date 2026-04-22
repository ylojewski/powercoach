import { type RouteHandlerMethod } from 'fastify'

import { InvalidCoachSettingsError } from '@/src/errors'
import { findCoachSettingsByCoachId } from '@/src/repositories'

import { type SettingsResponse } from './schemas'

export const getCurrentSettings: RouteHandlerMethod = async (
  request
): Promise<SettingsResponse> => {
  const settings = await findCoachSettingsByCoachId(request.server.db, request.coach.id)

  if (!settings) {
    throw new InvalidCoachSettingsError(request.coach.email)
  }

  return {
    defaultOrganizationId: settings.defaultOrganizationId
  }
}
