import { type AppConfig, resetCachedConfig } from '@/src/core'
import { HEALTH_MODULE_NAME } from '@/src/modules'
import { HELMET_PLUGIN_NAME, SENSIBLE_PLUGIN_NAME } from '@/src/plugins'
import { NodeEnv } from '@/src/types'
import { type AjvCompilerOptions } from '@/src/types/ajv'
import { invalidConfig, testConfig } from '@/test/fixtures/env'
import { getAjvOptions } from '@/test/utils/app'
import { stubEnv } from '@/test/utils/env'

import { ajvOptions } from './ajvOptions'
import { AppFastifyInstance, REQUEST_ID_HEADER, REQUEST_ID_LOG_LABEL, buildApp } from './buildApp'

const INFO_LEVEL = 30

const parseLogLines = (chunks: string[]): string[] =>
  chunks
    .join('')
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)

describe('buildApp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    resetCachedConfig()
  })

  describe('when using the passed configuration', () => {
    it('succeed if valid', async () => {
      const app = await buildApp({ config: testConfig })

      expect(app.hasDecorator('config')).toBe(true)
      expect(app.config).toStrictEqual<AppConfig>(testConfig)

      await app.close()
    })

    it('fails if invalid', async () => {
      await expect(buildApp({ config: invalidConfig })).rejects.toThrow(/^Invalid configuration/i)
    })
  })

  describe('when using the environment configuration', () => {
    it('succeed if valid', async () => {
      stubEnv(testConfig)

      const app = await buildApp()

      expect(app.hasDecorator('config')).toBe(true)
      expect(app.config).toStrictEqual<AppConfig>(testConfig)

      await app.close()
    })

    it('fails if invalid', async () => {
      stubEnv(invalidConfig)
      await expect(buildApp()).rejects.toThrow(/^Invalid environment configuration/i)
    })
  })

  describe('instance', () => {
    let app: AppFastifyInstance

    beforeEach(async () => {
      app = await buildApp({ config: testConfig })
    })

    afterEach(async () => {
      await app.close()
    })

    it('uses strict ajv options', async () => {
      expect(getAjvOptions(app)).toStrictEqual<AjvCompilerOptions>(ajvOptions)
    })

    it('registers required plugins and modules', async () => {
      expect(app.hasPlugin(HELMET_PLUGIN_NAME)).toBe(true)
      expect(app.hasPlugin(SENSIBLE_PLUGIN_NAME)).toBe(true)
      expect(app.hasPlugin(HEALTH_MODULE_NAME)).toBe(true)
    })

    it('logs relevant information', async () => {
      await app.close()

      const captured: string[] = []
      const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(((
        chunk: string | Uint8Array
      ) => {
        const value = typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8')
        captured.push(value)
        return true
      }) as typeof process.stdout.write)

      try {
        const loggingConfig = { ...testConfig, NODE_ENV: NodeEnv.production }
        app = await buildApp({ config: loggingConfig })

        app.get('/test-log', async (request, reply) => {
          const authorizationHeader = request.headers.authorization
          const visibleHeader = request.headers['x-visible-header']
          const authorization = Array.isArray(authorizationHeader)
            ? authorizationHeader[0]
            : authorizationHeader
          const visible = Array.isArray(visibleHeader) ? visibleHeader[0] : visibleHeader

          const baseSerializers =
            (
              request.server.log as unknown as {
                serializers?: Record<string, (value: unknown) => unknown>
              }
            ).serializers ?? {}

          const logger = request.server.log.child(
            {},
            {
              serializers: {
                ...baseSerializers,
                req(value: unknown) {
                  return value
                }
              }
            }
          )

          logger.info(
            {
              [REQUEST_ID_LOG_LABEL]: request.id,
              req: {
                headers: {
                  authorization,
                  'x-visible-header': visible
                }
              }
            },
            'Test log message'
          )

          return reply.send({ status: 'ok' })
        })

        const response = await app.inject({
          headers: {
            authorization: 'Bearer secret-token',
            'x-visible-header': 'keep-me'
          },
          method: 'GET',
          url: '/test-log'
        })

        await new Promise((resolve) => setImmediate(resolve))

        expect(response.statusCode).toBe(200)
        const requestId = response.headers[REQUEST_ID_HEADER]
        expect(requestId).toBeDefined()

        if (!requestId) {
          throw new Error('Request identifier header is missing')
        }

        const lines = parseLogLines(captured)
        expect(lines).toHaveLength(1)

        const [rawLine] = lines
        if (!rawLine) {
          throw new Error('No log output captured for assertion')
        }

        const entry = JSON.parse(rawLine)
        expect(entry).toMatchObject({
          level: INFO_LEVEL,
          msg: 'Test log message',
          [REQUEST_ID_LOG_LABEL]: requestId,
          req: {
            headers: {
              authorization: '[REDACTED]',
              'x-visible-header': 'keep-me'
            }
          }
        })
      } finally {
        writeSpy.mockRestore()
      }
    })
  })
})
