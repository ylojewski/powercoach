import { beforeEach, describe, expect, it, vi } from 'vitest'

const helmetMock = vi.fn()

vi.mock('@fastify/helmet', () => ({
  default: helmetMock
}))

vi.mock('fastify-plugin', () => ({
  default: (plugin: unknown) => plugin
}))

describe('helmetPlugin', () => {
  beforeEach(() => {
    helmetMock.mockClear()
  })

  it('registers helmet with relaxed CSP outside production', async () => {
    const { helmetPlugin } = await import('./helmet.plugin')
    const register = vi.fn().mockResolvedValue(undefined)
    const app = { config: { NODE_ENV: 'development' }, register }

    await helmetPlugin(app as never)

    expect(register).toHaveBeenCalledWith(helmetMock, {
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    })
  })

  it('registers helmet without overriding CSP in production', async () => {
    const { helmetPlugin } = await import('./helmet.plugin')
    const register = vi.fn().mockResolvedValue(undefined)
    const app = { config: { NODE_ENV: 'production' }, register }

    await helmetPlugin(app as never)

    expect(register).toHaveBeenCalledWith(helmetMock, {
      crossOriginEmbedderPolicy: false
    })
  })
})
