import { type FastifyInstance } from 'fastify'
import { type MockedFunction } from 'vitest'

import { REQUEST_MODULE_NAME } from '@/src/app'
import { schemasPlugin } from '@/src/plugins'
import { buildDummyApp } from '@/test/utils'

import {
  REFERENCES_MODULE_NAME,
  REFERENCES_MODULE_TAG,
  referencesModule,
  referencesModuleCore
} from './module'
import { referenceSchemas, referencesResponseSchema, type ReferencesResponse } from './schemas'
import * as service from './service'

function createReferencesResponse(): ReferencesResponse {
  return {
    disciplineMovements: [],
    disciplines: [],
    exerciseMuscles: [],
    exerciseRelationships: [],
    exerciseRoles: [],
    exercises: [],
    loadingTypes: [],
    muscleRoles: [],
    muscles: [],
    patterns: []
  }
}

describe('referencesModule', () => {
  it('exposes a custom name and tags', () => {
    expect(REFERENCES_MODULE_NAME).toBe('powercoach.references.module')
    expect(REFERENCES_MODULE_TAG).toBe('references')
  })

  it('does not register scoped authentication', async () => {
    const app = await buildDummyApp({
      ready: false,
      spies: ['register']
    })

    await referencesModuleCore(app, {})

    expect(app.register).not.toHaveBeenCalled()
    await app.close()
  })

  describe('runtime wiring', () => {
    let dummyApp: FastifyInstance
    let getReferencesMock: MockedFunction<typeof service.getReferences>

    beforeAll(async () => {
      getReferencesMock = vi.spyOn(service, 'getReferences')
      dummyApp = await buildDummyApp({
        plugins: [schemasPlugin, referencesModule],
        spies: ['addSchema', 'route'],
        withDb: true
      })
    })

    afterAll(async () => {
      vi.resetAllMocks()
      await dummyApp.close()
    })

    it('registers the reference schemas and GET / route wiring', () => {
      expect(dummyApp.addSchema).toHaveBeenCalledTimes(referenceSchemas.length + 1)
      referenceSchemas.forEach((schema) => {
        expect(dummyApp.addSchema).toHaveBeenCalledWith(schema)
      })
      expect(dummyApp.route).toHaveBeenCalledTimes(1)
      expect(dummyApp.route).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          schema: expect.objectContaining({
            operationId: 'getReferences',
            response: expect.objectContaining({
              200: expect.objectContaining(referencesResponseSchema)
            }),
            tags: [REFERENCES_MODULE_TAG]
          }),
          url: '/'
        })
      )
    })

    it('sets the module header and delegates GET / to the service', async () => {
      const referencesResponse = createReferencesResponse()

      getReferencesMock.mockResolvedValueOnce(referencesResponse)

      const response = await dummyApp.inject({
        method: 'GET',
        url: '/'
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers[REQUEST_MODULE_NAME]).toBe(REFERENCES_MODULE_NAME)
      expect(service.getReferences).toHaveBeenCalledTimes(1)
      expect(response.json()).toStrictEqual<ReferencesResponse>(referencesResponse)
    })
  })
})
