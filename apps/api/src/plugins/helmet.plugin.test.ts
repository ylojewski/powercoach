import helmet from '@fastify/helmet'
import { buildDummyApp } from '@test/utils/app'
import { MockedFunction } from 'vitest'
import { helmetPlugin } from './helmet.plugin'
import { NODE_ENV } from '@/types/env.d'

vi.mock('@fastify/helmet', () => ({
  default: vi.fn()
}))

const helmetMock = helmet as MockedFunction<typeof helmet>

describe('helmetPlugin', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  it('registers helmet with relaxed CSP outside production', async () => {
    const app = await buildDummyApp({
      plugins: [helmetPlugin],
      withConfig: NODE_ENV.development
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
      withConfig: NODE_ENV.production
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
