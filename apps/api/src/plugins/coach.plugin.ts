import { coaches } from '@powercoach/db'
import { eq } from 'drizzle-orm'
import { type FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

export type FastifyRequestCoach = typeof coaches.$inferSelect

export const COACH_PLUGIN_NAME = 'powercoach.coach.plugin' as const
export const COACH_EMAIL_HEADER = 'x-coach-email' as const

export function getCoachEmailHeader(value: string | string[] | undefined): string | null {
  return typeof value === 'string' ? value.trim() || null : null
}

export const coachPluginCore: FastifyPluginAsync = async (app) => {
  app.decorateRequest('coach', null as unknown as FastifyRequestCoach)

  app.addHook('onRequest', async (request) => {
    const coachEmail = getCoachEmailHeader(request.headers[COACH_EMAIL_HEADER])

    if (!coachEmail) {
      throw request.server.httpErrors.unauthorized(`Missing "${COACH_EMAIL_HEADER}" header`)
    }

    const [coach] = await request.server.db
      .select()
      .from(coaches)
      .where(eq(coaches.email, coachEmail))
      .limit(1)

    if (!coach) {
      throw request.server.httpErrors.unauthorized(`Coach "${coachEmail}" not found`)
    }

    request.coach = coach
  })
}

export const coachPlugin = fastifyPlugin(coachPluginCore, {
  name: COACH_PLUGIN_NAME
})

declare module 'fastify' {
  interface FastifyRequest {
    coach: FastifyRequestCoach
  }
}
