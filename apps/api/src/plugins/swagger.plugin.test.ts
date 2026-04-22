import swagger from '@fastify/swagger'
import { MockedFunction } from 'vitest'

import { HEALTH_MODULE_TAG, ROSTER_MODULE_TAG, SETTINGS_MODULE_TAG } from '@/src/modules'
import { buildDummyApp } from '@/test/utils'

import { SWAGGER_PLUGIN_NAME, swaggerPlugin } from './swagger.plugin'
import packageJson from '../../package.json'

vi.mock('@fastify/swagger', () => ({
  default: vi.fn()
}))

const swaggerMock = swagger as MockedFunction<typeof swagger>

describe('swaggerPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('exposes a custom name', () => {
    expect(SWAGGER_PLUGIN_NAME).toBe('powercoach.swagger.plugin')
  })

  it('registers swagger with the package version and documented tags', async () => {
    const app = await buildDummyApp({
      plugins: [swaggerPlugin]
    })

    expect(swaggerMock).toHaveBeenCalledOnce()
    expect(swaggerMock.mock.calls[0]?.[1]).toStrictEqual({
      openapi: {
        info: {
          title: 'Powercoach API',
          version: packageJson.version
        },
        tags: [
          { description: 'Roster endpoints', name: ROSTER_MODULE_TAG },
          { description: 'Coach settings endpoints', name: SETTINGS_MODULE_TAG },
          { description: 'Application health endpoints', name: HEALTH_MODULE_TAG }
        ]
      }
    })

    await app.close()
  })

  it('throws when npm_package_version is missing', async () => {
    vi.resetModules()
    vi.stubEnv('npm_package_version', '')

    await expect(import('./swagger.plugin')).rejects.toThrowError(
      'Missing process.env.npm_package_version'
    )
  })
})
