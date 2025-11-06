import helmet from '@fastify/helmet'
import { NodeEnv } from '@src/types'
import { buildDummyApp } from '@test/utils/app'
import { MockedFunction } from 'vitest'
import { HELMET_PLUGIN_NAME, helmetPlugin } from './helmet.plugin'

vi.mock('@fastify/helmet', () => ({
  default: vi.fn()
}))

const helmetMock = helmet as MockedFunction<typeof helmet>

describe('helmetPlugin', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  it('exposes a custom name', () => {
    expect(HELMET_PLUGIN_NAME).toBe('powercoach.helmet.plugin')
  })

  it('registers helmet with relaxed CSP outside production', async () => {
    const app = await buildDummyApp({
      plugins: [helmetPlugin],
      withConfig: NodeEnv.development
    })

    expect(helmetMock).toHaveBeenCalledOnce()
    expect(helmetMock.mock.calls[0]?.[1]).toStrictEqual({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    })

    await app.close()
  })

  it('registers helmet without overriding CSP in production', async () => {
    const app = await buildDummyApp({
      plugins: [helmetPlugin],
      withConfig: NodeEnv.production
    })

    expect(helmetMock).toHaveBeenCalledOnce()
    expect(helmetMock.mock.calls[0]?.[1]).toStrictEqual({
      crossOriginEmbedderPolicy: false
    })
    expect(helmetMock.mock.calls[0]?.[1]).not.toContain({
      contentSecurityPolicy: false
    })

    await app.close()
  })
})
