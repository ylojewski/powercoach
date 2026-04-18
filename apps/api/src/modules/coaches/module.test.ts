import { type FastifyInstance } from 'fastify'
import { type MockedFunction } from 'vitest'

import { REQUEST_MODULE_NAME } from '@/src/app'
import { buildDummyApp } from '@/test/utils'

import { COACHES_MODULE_NAME, COACHES_MODULE_TAG, coachesModule } from './module'
import {
  ATHLETE_SUMMARY_SCHEMA_ID,
  COACH_CONTEXT_RESPONSE_SCHEMA_ID,
  COACH_SUMMARY_SCHEMA_ID,
  type CoachContextResponse,
  coachContextResponseSchema,
  ORGANIZATION_SUMMARY_SCHEMA_ID
} from './schemas'
import * as service from './service'

describe('coachesModule', () => {
  let dummyApp: FastifyInstance
  let getCurrentCoachContextMock: MockedFunction<typeof service.getCurrentCoachContext>

  beforeAll(async () => {
    getCurrentCoachContextMock = vi.spyOn(service, 'getCurrentCoachContext')
    dummyApp = await buildDummyApp({
      plugins: [coachesModule],
      spies: ['addSchema', 'route'],
      withDb: true
    })
  })

  afterAll(async () => {
    vi.resetAllMocks()
    await dummyApp.close()
  })

  it('exposes a custom name and tags', () => {
    expect(COACHES_MODULE_NAME).toBe('powercoach.coaches.module')
    expect(COACHES_MODULE_TAG).toBe('coaches')
  })

  it('adds the coaches schemas', () => {
    expect(dummyApp.addSchema).toHaveBeenCalledTimes(4)
    expect(dummyApp.addSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        $id: COACH_SUMMARY_SCHEMA_ID,
        properties: expect.objectContaining({
          email: expect.objectContaining({ format: 'email', type: 'string' }),
          firstName: expect.objectContaining({ type: 'string' }),
          id: expect.objectContaining({ type: 'number' }),
          lastName: expect.objectContaining({ type: 'string' })
        }),
        required: ['email', 'firstName', 'id', 'lastName']
      })
    )
    expect(dummyApp.addSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        $id: ORGANIZATION_SUMMARY_SCHEMA_ID,
        properties: expect.objectContaining({
          id: expect.objectContaining({ type: 'number' }),
          name: expect.objectContaining({ type: 'string' })
        }),
        required: ['id', 'name']
      })
    )
    expect(dummyApp.addSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        $id: ATHLETE_SUMMARY_SCHEMA_ID,
        properties: expect.objectContaining({
          email: expect.objectContaining({ format: 'email', type: 'string' }),
          firstName: expect.objectContaining({ type: 'string' }),
          id: expect.objectContaining({ type: 'number' }),
          lastName: expect.objectContaining({ type: 'string' })
        }),
        required: ['email', 'firstName', 'id', 'lastName']
      })
    )
    expect(dummyApp.addSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        $id: COACH_CONTEXT_RESPONSE_SCHEMA_ID,
        properties: expect.objectContaining({
          athletes: expect.objectContaining({ type: 'array' }),
          coach: expect.objectContaining({ $ref: COACH_SUMMARY_SCHEMA_ID }),
          organizations: expect.objectContaining({ type: 'array' })
        }),
        required: ['athletes', 'coach', 'organizations']
      })
    )
  })

  it('registers the GET /me route using the CoachContextResponse schema', () => {
    expect(dummyApp.route).toHaveBeenCalledTimes(1)
    expect(dummyApp.route).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        schema: expect.objectContaining({
          operationId: 'getCurrentCoachContext',
          response: expect.objectContaining({
            200: expect.objectContaining(coachContextResponseSchema)
          }),
          tags: [COACHES_MODULE_TAG]
        }),
        url: '/me'
      })
    )
  })

  it('returns a valid CoachContextResponse from the GET /me route using the service', async () => {
    const coachContextResponse: CoachContextResponse = {
      athletes: [
        {
          email: 'kiro.flux@example.test',
          firstName: 'Kiro',
          id: 11,
          lastName: 'Flux'
        }
      ],
      coach: {
        email: 'astra.quill@example.test',
        firstName: 'Astra',
        id: 10,
        lastName: 'Quill'
      },
      organizations: [{ id: 1, name: 'Orbit Foundry' }]
    }

    getCurrentCoachContextMock.mockResolvedValueOnce(coachContextResponse)

    const response = await dummyApp.inject({
      headers: { [service.COACH_EMAIL_HEADER]: coachContextResponse.coach.email },
      method: 'GET',
      url: '/me'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.headers[REQUEST_MODULE_NAME]).toBe(COACHES_MODULE_NAME)
    expect(service.getCurrentCoachContext).toHaveBeenCalledTimes(1)
    expect(response.json()).toStrictEqual<CoachContextResponse>(coachContextResponse)
  })
})
