import { type Options } from '@fastify/ajv-compiler'
import { flushAsync, spyOnConsole, spyOnStdout, stubEnv } from '@powercoach/util-test'
import { type FastifyRequest } from 'fastify'
import { z } from 'zod'

import { type Env, resetCachedEnv } from '@/src/core'
import { HEALTH_MODULE_NAME } from '@/src/modules'
import { HELMET_PLUGIN_NAME, SENSIBLE_PLUGIN_NAME } from '@/src/plugins'
import { createRealEnv, invalidEnv, testEnv } from '@/test/fixtures'
import { getAjvOptions } from '@/test/utils'

import { ajvOptions } from './ajvOptions'
import { type AppFastifyInstance, buildApp } from './buildApp'
import { REQUEST_ID_HEADER, REQUEST_ID_LOG_LABEL, REQUEST_MODULE_NAME } from './constants'

spyOnConsole(['error'])
const env = createRealEnv()

describe('buildApp', () => {
  beforeEach(() => {
    resetCachedEnv()
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  describe('when using the passed configuration', () => {
    it('succeed if valid', async () => {
      const app = await buildApp({ env })
      const endSpy = vi.spyOn(app.pg, 'end')

      await app.ready()

      expect(app.hasDecorator('env')).toBe(true)
      expect(app.env).toStrictEqual<Env>(env)

      expect(app.hasDecorator('db')).toBe(true)
      expect(app.db).toBeDefined()
      expect(typeof app.db.select).toBe('function')
      expect(typeof app.db.insert).toBe('function')
      expect(typeof app.db.update).toBe('function')
      expect(typeof app.db.delete).toBe('function')

      await app.close()

      expect(endSpy).toHaveBeenCalledOnce()
    })

    it('fails if invalid', async () => {
      await expect(buildApp({ env: invalidEnv })).rejects.toThrow(/^Invalid environment/i)
    })

    it('fails if connexion to database can not be established', async () => {
      await expect(buildApp({ env: testEnv })).rejects.toThrow(
        expect.objectContaining({ code: 'ECONNREFUSED' })
      )
    })
  })

  describe('when using the environment configuration', () => {
    it('succeed if valid', async () => {
      stubEnv(env)
      const app = await buildApp()
      await app.ready()
      expect(app.env).toStrictEqual<Env>(env)
      await app.close()
    })

    it('fails if invalid', async () => {
      stubEnv(invalidEnv)
      await expect(buildApp()).rejects.toThrow(/^Invalid environment/i)
    })

    it('fails if connexion to database can not be established', async () => {
      stubEnv(testEnv)
      await expect(buildApp({ env: testEnv })).rejects.toThrow(
        expect.objectContaining({ code: 'ECONNREFUSED' })
      )
    })
  })

  describe('production instance', () => {
    let app: AppFastifyInstance
    let stdoutSpy: ReturnType<typeof spyOnStdout>

    beforeEach(async () => {
      stdoutSpy = spyOnStdout()
      app = await buildApp({ env: createRealEnv('production') })
    })

    afterEach(async () => {
      stdoutSpy.mock.mockRestore()
      await app.close()
    })

    it('starts with a predefined set of options, plugins and modules', async () => {
      await app.ready()
      expect(getAjvOptions(app)).toStrictEqual<Options>(ajvOptions)
      expect(app.hasPlugin(HELMET_PLUGIN_NAME)).toBe(true)
      expect(app.hasPlugin(SENSIBLE_PLUGIN_NAME)).toBe(true)
      expect(app.hasPlugin(HEALTH_MODULE_NAME)).toBe(true)
    })

    it('generates a reliable request id if none is given', async () => {
      const uuidSchema = z.uuid()
      const url = '/test-request-id' as const

      app.get(url, (_, reply) => reply.send({ status: 'ok' }))

      const firstResponse = await app.inject({ url })
      const firstRequestId = firstResponse.headers[REQUEST_ID_HEADER]

      const secondResponse = await app.inject({ url })
      const secondRequestId = secondResponse.headers[REQUEST_ID_HEADER]

      const thirdResponse = await app.inject({ headers: { [REQUEST_ID_HEADER]: 'fake-id' }, url })
      const thirdRequestId = thirdResponse.headers[REQUEST_ID_HEADER]

      expect(uuidSchema.safeParse(firstRequestId)).toMatchObject(
        expect.objectContaining({ success: true })
      )
      expect(uuidSchema.safeParse(secondRequestId)).toMatchObject(
        expect.objectContaining({ success: true })
      )
      expect(firstRequestId).not.toBe(secondRequestId)
      expect(thirdRequestId).toBe('fake-id')
    })

    it('logs relevant information', async () => {
      const url = '/test-log' as const

      app.get(url, async (request, reply) => {
        request.log.info({ req: request })
        return reply.send({ status: 'ok' })
      })

      await app.inject({ headers: { authorization: 'Bearer secret' }, url })
      await flushAsync()

      const logs = stdoutSpy.json<{ req: FastifyRequest }[]>()

      // Asserts disableRequestLogging is true
      expect(logs.length).toBe(1)
      expect(logs[0]).toMatchObject(
        expect.objectContaining({
          req: expect.objectContaining({
            // Asserts headers serialization and redaction
            headers: expect.objectContaining({ authorization: '[Redacted]' })
          }),
          // Asserts REQUEST_ID_LOG_LABEL is used
          [REQUEST_ID_LOG_LABEL]: expect.any(String)
        })
      )
    })

    it('mounts the health module on /v1/health', async () => {
      const { headers } = await app.inject({ url: '/v1/health' })
      expect(headers[REQUEST_MODULE_NAME]).toBe(HEALTH_MODULE_NAME)
    })
  })
})
