import { COACH_EMAIL } from '@powercoach/util-fixture'
import { Type } from '@sinclair/typebox'
import { type FastifyInstance } from 'fastify'

import { ApplicationError, InvalidCoachSettingsError } from '@/src/errors'
import { buildDummyApp } from '@/test/utils'

import { ERROR_PLUGIN_NAME, errorPlugin } from './error.plugin'
import { sensiblePlugin } from './sensible.plugin'

describe('errorPlugin', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildDummyApp({
      plugins: [sensiblePlugin, errorPlugin],
      ready: false
    })

    app.get('/invalid-settings', () => {
      throw new InvalidCoachSettingsError(COACH_EMAIL)
    })
    app.get('/forbidden', () => {
      throw app.httpErrors.forbidden('forbidden')
    })
    app.get('/non-standard-status', () => {
      throw new ApplicationError('non-standard', 499)
    })
    app.get(
      '/validation-error',
      {
        schema: {
          querystring: Type.Object({
            organizationId: Type.String({ pattern: '^[1-9]\\d*$' })
          })
        }
      },
      () => ({ ok: true })
    )
    app.get('/boom', () => {
      throw new Error('boom')
    })

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('exposes a custom name', () => {
    expect(ERROR_PLUGIN_NAME).toBe('powercoach.error.plugin')
  })

  it('maps application errors to a stable HTTP payload', async () => {
    const response = await app.inject({ method: 'GET', url: '/invalid-settings' })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toStrictEqual({
      error: 'Internal Server Error',
      message: `Coach settings for "${COACH_EMAIL}" are invalid`,
      statusCode: 500
    })
  })

  it('preserves explicit client HTTP errors', async () => {
    const response = await app.inject({ method: 'GET', url: '/forbidden' })

    expect(response.statusCode).toBe(403)
    expect(response.json()).toStrictEqual({
      error: 'Forbidden',
      message: 'forbidden',
      statusCode: 403
    })
  })

  it('falls back to a generic label for non-standard status codes', async () => {
    const response = await app.inject({ method: 'GET', url: '/non-standard-status' })

    expect(response.statusCode).toBe(499)
    expect(response.json()).toStrictEqual({
      error: 'Error',
      message: 'non-standard',
      statusCode: 499
    })
  })

  it('preserves Fastify validation client errors', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/validation-error?organizationId=invalid'
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toMatchObject({
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      statusCode: 400
    })
    expect(response.json<{ message: string }>().message).toContain('organizationId')
  })

  it('delegates unknown failures to Fastify default error handling', async () => {
    const response = await app.inject({ method: 'GET', url: '/boom' })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toStrictEqual({
      error: 'Internal Server Error',
      message: 'boom',
      statusCode: 500
    })
  })
})
