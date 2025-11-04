import { createEmptyApp } from '@test/utils/app'
import { expect } from 'vitest'
import { NODE_ENV } from '@/types/env.d'

const helmetSpy = vi.fn()

vi.mock('@fastify/helmet', () => ({
  default: helmetSpy
}))

describe('helmetPlugin', () => {
  beforeEach(() => {
    helmetSpy.mockClear()
  })

  it('registers helmet with relaxed CSP outside production', async () => {
    const { helmetPlugin } = await import('./helmet.plugin')
    const app = createEmptyApp({ withConfig: true })

    await app.register(helmetPlugin)

    expect(helmetSpy).toHaveBeenCalledOnce()
    expect(helmetSpy.mock.calls[0]?.[1]).toStrictEqual({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    })

    await app.close()
  })

  it('registers helmet without overriding CSP in production', async () => {
    const { helmetPlugin } = await import('./helmet.plugin')
    const app = createEmptyApp({ withConfig: NODE_ENV.production })

    await app.register(helmetPlugin)

    expect(helmetSpy).toHaveBeenCalledOnce()
    expect(helmetSpy.mock.calls[0]?.[1]).toStrictEqual({
      crossOriginEmbedderPolicy: false
    })
    expect(helmetSpy.mock.calls[0]?.[1]).not.toContain({
      contentSecurityPolicy: false
    })

    await app.close()
  })
})
