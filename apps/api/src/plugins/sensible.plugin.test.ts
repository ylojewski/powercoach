import { describe, expect, it, vi } from 'vitest'

const sensibleMock = vi.fn()

vi.mock('@fastify/sensible', () => ({
  default: sensibleMock
}))

vi.mock('fastify-plugin', () => ({
  default: (plugin: unknown) => plugin
}))

describe('sensiblePlugin', () => {
  it('registers the sensible plugin', async () => {
    const { sensiblePlugin } = await import('./sensible.plugin')
    const register = vi.fn().mockResolvedValue(undefined)
    const app = { register }

    await sensiblePlugin(app as never)

    expect(register).toHaveBeenCalledWith(sensibleMock)
  })
})
