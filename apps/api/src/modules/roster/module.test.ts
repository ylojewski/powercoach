import { COACH_EMAIL } from '@powercoach/util-fixture'
import { type MockedDb } from '@powercoach/util-test'
import { type FastifyInstance } from 'fastify'
import { type MockedFunction } from 'vitest'

import { REQUEST_MODULE_NAME } from '@/src/app'
import { coachPlugin, COACH_EMAIL_HEADER } from '@/src/plugins'
import { buildDummyApp } from '@/test/utils'

import { ROSTER_MODULE_NAME, ROSTER_MODULE_TAG, rosterModule, rosterModuleCore } from './module'
import {
  athleteSchema,
  coachSchema,
  organizationSchema,
  type RosterResponse,
  rosterQuerystringSchema,
  rosterResponseSchema
} from './schemas'
import * as service from './service'

describe('rosterModule', () => {
  it('exposes a custom name and tags', () => {
    expect(ROSTER_MODULE_NAME).toBe('powercoach.roster.module')
    expect(ROSTER_MODULE_TAG).toBe('roster')
  })

  it('registers the coach plugin', async () => {
    const app = await buildDummyApp({
      ready: false,
      spies: ['register']
    })
    await rosterModuleCore(app, {})
    expect(app.register).toHaveBeenCalledOnce()
    expect(app.register).toHaveBeenCalledWith(coachPlugin)
    await app.close()
  })

  describe('runtime wiring', () => {
    let dummyApp: FastifyInstance
    let dbMock: MockedDb
    let getCurrentRosterMock: MockedFunction<typeof service.getCurrentRoster>

    beforeAll(async () => {
      getCurrentRosterMock = vi.spyOn(service, 'getCurrentRoster')
      dummyApp = await buildDummyApp({
        plugins: [rosterModule],
        spies: ['addSchema', 'route'],
        withDb: true
      })
      dbMock = dummyApp.db as unknown as MockedDb
    })

    afterAll(async () => {
      vi.resetAllMocks()
      await dummyApp.close()
    })

    it('registers the roster schemas and GET /me route wiring', () => {
      expect(dummyApp.addSchema).toHaveBeenCalledTimes(4)
      expect(dummyApp.addSchema).toHaveBeenCalledWith(expect.objectContaining(coachSchema))
      expect(dummyApp.addSchema).toHaveBeenCalledWith(expect.objectContaining(organizationSchema))
      expect(dummyApp.addSchema).toHaveBeenCalledWith(expect.objectContaining(athleteSchema))
      expect(dummyApp.addSchema).toHaveBeenCalledWith(expect.objectContaining(rosterResponseSchema))
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

    it('sets the module header and delegates GET /me to the service', async () => {
      const rosterResponse = { coach: { email: COACH_EMAIL } } as RosterResponse

      dbMock.mockResolvedValueOnce([{ email: COACH_EMAIL }])
      getCurrentRosterMock.mockResolvedValueOnce(rosterResponse)

      const response = await dummyApp.inject({
        headers: { [COACH_EMAIL_HEADER]: COACH_EMAIL },
        method: 'GET',
        url: '/me'
      })

      expect(response.headers[REQUEST_MODULE_NAME]).toBe(ROSTER_MODULE_NAME)
      expect(service.getCurrentRoster).toHaveBeenCalledTimes(1)
    })
  })
})
