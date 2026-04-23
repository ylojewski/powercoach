import { COACH_EMAIL, SETTINGS_RESPONSE } from '@powercoach/util-fixture'
import { type MockedDb } from '@powercoach/util-test'
import { type FastifyInstance } from 'fastify'
import { type MockedFunction } from 'vitest'

import { REQUEST_MODULE_NAME } from '@/src/app'
import { coachPlugin, COACH_EMAIL_HEADER } from '@/src/plugins'
import { buildDummyApp } from '@/test/utils'

import {
  SETTINGS_MODULE_NAME,
  SETTINGS_MODULE_TAG,
  settingsModule,
  settingsModuleCore
} from './module'
import { type SettingsResponse, settingsResponseSchema } from './schemas'
import * as service from './service'

describe('settingsModule', () => {
  it('exposes a custom name and tags', () => {
    expect(SETTINGS_MODULE_NAME).toBe('powercoach.settings.module')
    expect(SETTINGS_MODULE_TAG).toBe('settings')
  })

  it('registers the coach plugin', async () => {
    const app = await buildDummyApp({
      ready: false,
      spies: ['register']
    })
    await settingsModuleCore(app, {})
    expect(app.register).toHaveBeenCalledOnce()
    expect(app.register).toHaveBeenCalledWith(coachPlugin)
    await app.close()
  })

  describe('runtime wiring', () => {
    let dummyApp: FastifyInstance
    let dbMock: MockedDb
    let getCurrentSettingsMock: MockedFunction<typeof service.getCurrentSettings>

    beforeAll(async () => {
      getCurrentSettingsMock = vi.spyOn(service, 'getCurrentSettings')
      dummyApp = await buildDummyApp({
        plugins: [settingsModule],
        spies: ['addSchema', 'route'],
        withDb: true
      })
      dbMock = dummyApp.db as unknown as MockedDb
    })

    afterAll(async () => {
      vi.resetAllMocks()
      await dummyApp.close()
    })

    it('registers the SettingsResponse schema and GET /me route wiring', () => {
      expect(dummyApp.addSchema).toHaveBeenCalledOnce()
      expect(dummyApp.addSchema).toHaveBeenCalledWith(
        expect.objectContaining(settingsResponseSchema)
      )
      expect(dummyApp.route).toHaveBeenCalledTimes(1)
      expect(dummyApp.route).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          schema: expect.objectContaining({
            operationId: 'getCurrentSettings',
            response: expect.objectContaining({
              200: expect.objectContaining(settingsResponseSchema)
            }),
            tags: [SETTINGS_MODULE_TAG]
          }),
          url: '/me'
        })
      )
    })

    it('sets the module header and delegates GET /me to the service', async () => {
      const settingsResponse: SettingsResponse = { ...SETTINGS_RESPONSE }

      dbMock.mockResolvedValueOnce([{ email: COACH_EMAIL }])
      getCurrentSettingsMock.mockResolvedValueOnce(settingsResponse)

      const response = await dummyApp.inject({
        headers: { [COACH_EMAIL_HEADER]: COACH_EMAIL },
        method: 'GET',
        url: '/me'
      })

      expect(response.headers[REQUEST_MODULE_NAME]).toBe(SETTINGS_MODULE_NAME)
      expect(service.getCurrentSettings).toHaveBeenCalledTimes(1)
    })
  })
})
