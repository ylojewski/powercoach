import { type FastifyRequest, type RouteGenericInterface } from 'fastify'

import { findExerciseByCode } from '@/src/repositories'

import { type ExerciseCodeQuerystring, type ExerciseCodeResponse } from './schemas'
import { getExerciseCodeFromTitle } from './utils'

interface GetExerciseCodeRoute extends RouteGenericInterface {
  Querystring: ExerciseCodeQuerystring
}

export const getExerciseCode = async (
  request: FastifyRequest<GetExerciseCodeRoute>
): Promise<ExerciseCodeResponse> => {
  const code = getExerciseCodeFromTitle(request.query.title)
  const exercise = code ? await findExerciseByCode(request.server.db, code) : null

  return { code, exercise }
}
