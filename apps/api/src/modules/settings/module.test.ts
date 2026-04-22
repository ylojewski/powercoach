import { type FastifyInstance } from 'fastify'
import { type Mock, type MockedFunction } from 'vitest'

import { REQUEST_MODULE_NAME } from '@/src/app'
import { COACH_EMAIL_HEADER } from '@/src/plugins'
import { buildDummyApp } from '@/test/utils'

import { SETTINGS_MODULE_NAME, SETTINGS_MODULE_TAG, settingsModule } from './module'
import {
  SETTINGS_RESPONSE_SCHEMA_ID,
  type SettingsResponse,
  settingsResponseSchema
} from './schemas'
import * as service from './service'

describe('settingsModule', () => {
  let dummyApp: FastifyInstance
  let getCurrentSettingsMock: MockedFunction<typeof service.getCurrentSettings>

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
    getCurrentSettingsMock = vi.spyOn(service, 'getCurrentSettings')
    dummyApp = await buildDummyApp({
      plugins: [settingsModule],
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
    expect(SETTINGS_MODULE_NAME).toBe('powercoach.settings.module')
    expect(SETTINGS_MODULE_TAG).toBe('settings')
  })

  it('adds the SettingsResponse schema', () => {
    expect(dummyApp.addSchema).toHaveBeenCalledOnce()
    expect(dummyApp.addSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        $id: SETTINGS_RESPONSE_SCHEMA_ID,
        additionalProperties: false,
        properties: expect.objectContaining({
          defaultOrganizationId: expect.objectContaining({ type: 'number' })
        }),
        required: ['defaultOrganizationId']
      })
    )
  })

  it('registers the GET /me route using the SettingsResponse schema', () => {
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

  it('returns a valid SettingsResponse from the GET /me route using the service', async () => {
    const settingsResponse: SettingsResponse = {
      defaultOrganizationId: 1
    }

    getCurrentSettingsMock.mockResolvedValueOnce(settingsResponse)

    const response = await dummyApp.inject({
      headers: { [COACH_EMAIL_HEADER]: 'astra.quill@example.test' },
      method: 'GET',
      url: '/me'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.headers[REQUEST_MODULE_NAME]).toBe(SETTINGS_MODULE_NAME)
    expect(service.getCurrentSettings).toHaveBeenCalledTimes(1)
    expect(response.json()).toStrictEqual<SettingsResponse>(settingsResponse)
  })
})
