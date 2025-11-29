import { fallbackUser } from '@powercoach/db'
import { FastifyInstance } from 'fastify'

import { buildDummyApp } from '@/test/utils'

import { USER_MODULE_NAME, userModule } from './module'
import { USER_RESPONSE_SCHEMA_ID, userResponseSchema } from './schemas'
import * as service from './service'

describe('userModule', () => {
  let dummyApp: FastifyInstance

  beforeAll(async () => {
    vi.spyOn(service, 'getUserProfile').mockResolvedValue(fallbackUser)
    dummyApp = await buildDummyApp({
      plugins: [userModule],
      spies: ['addSchema', 'route']
    })
  })

  afterAll(async () => {
    vi.resetAllMocks()
    await dummyApp.close()
  })

  it('exposes a custom name', () => {
    expect(USER_MODULE_NAME).toBe('powercoach.user.module')
  })

  it('adds the UserResponse schema', () => {
    expect(dummyApp.addSchema).toHaveBeenCalledOnce()
    expect(dummyApp.addSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        $id: USER_RESPONSE_SCHEMA_ID,
        properties: expect.objectContaining({
          email: expect.objectContaining({ format: 'email', type: 'string' }),
          id: expect.objectContaining({ format: 'uuid', type: 'string' })
        }),
        required: ['email', 'id']
      })
    )
  })

  it('registers the GET / route using the UserResponse schema', () => {
    expect(dummyApp.route).toHaveBeenCalledTimes(1)
    expect(dummyApp.route).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        schema: expect.objectContaining({
          response: expect.objectContaining({
            200: expect.objectContaining(userResponseSchema)
          })
        }),
        url: '/'
      })
    )
  })

  it('returns the first user from the GET / route using the service', async () => {
    const response = await dummyApp.inject({ method: 'GET', url: '/' })

    expect(response.statusCode).toBe(200)
    expect(service.getUserProfile).toHaveBeenCalledOnce()
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.json()).toStrictEqual(fallbackUser)
  })
})
