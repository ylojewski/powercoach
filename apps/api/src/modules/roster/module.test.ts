import { type FastifyInstance } from 'fastify'
import { type Mock, type MockedFunction } from 'vitest'

import { REQUEST_MODULE_NAME } from '@/src/app'
import { COACH_EMAIL_HEADER } from '@/src/plugins'
import { buildDummyApp } from '@/test/utils'

import { ROSTER_MODULE_NAME, ROSTER_MODULE_TAG, rosterModule } from './module'
import {
  ATHLETE_SCHEMA_ID,
  COACH_SCHEMA_ID,
  ORGANIZATION_SCHEMA_ID,
  ROSTER_RESPONSE_SCHEMA_ID,
  type RosterResponse,
  rosterQuerystringSchema,
  rosterResponseSchema
} from './schemas'
import * as service from './service'

describe('rosterModule', () => {
  let dummyApp: FastifyInstance
  let getCurrentRosterMock: MockedFunction<typeof service.getCurrentRoster>

  function mockCoachLookup() {
    ;(dummyApp.db.select as unknown as Mock).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              email: 'astra.quill@example.test',
              firstName: 'Astra',
              id: 10,
              lastName: 'Quill'
            }
          ])
        })
      })
    })
  }

  beforeAll(async () => {
    getCurrentRosterMock = vi.spyOn(service, 'getCurrentRoster')
    dummyApp = await buildDummyApp({
      plugins: [rosterModule],
      spies: ['addSchema', 'route'],
      withDb: true
    })
    mockCoachLookup()
  })

  afterAll(async () => {
    vi.resetAllMocks()
    await dummyApp.close()
  })

  it('exposes a custom name and tags', () => {
    expect(ROSTER_MODULE_NAME).toBe('powercoach.roster.module')
    expect(ROSTER_MODULE_TAG).toBe('roster')
  })

  it('adds the roster schemas', () => {
    expect(dummyApp.addSchema).toHaveBeenCalledTimes(4)
    expect(dummyApp.addSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        $id: COACH_SCHEMA_ID,
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
        $id: ORGANIZATION_SCHEMA_ID,
        properties: expect.objectContaining({
          id: expect.objectContaining({ type: 'number' }),
          name: expect.objectContaining({ type: 'string' })
        }),
        required: ['id', 'name']
      })
    )
    expect(dummyApp.addSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        $id: ATHLETE_SCHEMA_ID,
        properties: expect.objectContaining({
          email: expect.objectContaining({ format: 'email', type: 'string' }),
          firstName: expect.objectContaining({ type: 'string' }),
          id: expect.objectContaining({ type: 'number' }),
          lastName: expect.objectContaining({ type: 'string' }),
          organizationId: expect.objectContaining({ type: 'number' })
        }),
        required: ['email', 'firstName', 'id', 'lastName', 'organizationId']
      })
    )
    expect(dummyApp.addSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        $id: ROSTER_RESPONSE_SCHEMA_ID,
        properties: expect.objectContaining({
          athletes: expect.objectContaining({ type: 'array' }),
          coach: expect.objectContaining({ $ref: COACH_SCHEMA_ID }),
          organizations: expect.objectContaining({ type: 'array' })
        }),
        required: ['athletes', 'coach', 'organizations']
      })
    )
  })

  it('registers the GET /me route using the RosterResponse schema', () => {
    expect(dummyApp.route).toHaveBeenCalledTimes(1)
    expect(dummyApp.route).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        schema: expect.objectContaining({
          operationId: 'getCurrentRoster',
          querystring: expect.objectContaining(rosterQuerystringSchema),
          response: expect.objectContaining({
            200: expect.objectContaining(rosterResponseSchema)
          }),
          tags: [ROSTER_MODULE_TAG]
        }),
        url: '/me'
      })
    )
  })

  it('returns a valid RosterResponse from the GET /me route using the service', async () => {
    const rosterResponse: RosterResponse = {
      athletes: [
        {
          email: 'kiro.flux@example.test',
          firstName: 'Kiro',
          id: 11,
          lastName: 'Flux',
          organizationId: 1
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

    getCurrentRosterMock.mockResolvedValueOnce(rosterResponse)

    const response = await dummyApp.inject({
      headers: { [COACH_EMAIL_HEADER]: rosterResponse.coach.email },
      method: 'GET',
      url: '/me'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.headers[REQUEST_MODULE_NAME]).toBe(ROSTER_MODULE_NAME)
    expect(service.getCurrentRoster).toHaveBeenCalledTimes(1)
    expect(response.json()).toStrictEqual<RosterResponse>(rosterResponse)
  })
})
