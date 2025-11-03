import Fastify from 'fastify'
import { describe, expect, it } from 'vitest'
import { helmetPlugin } from './helmet.plugin'
import type { AppConfig } from '@/core/config/envSchema'

const baseConfig: AppConfig = {
  HOST: '127.0.0.1',
  LOG_LEVEL: 'silent',
  NODE_ENV: 'test',
  PORT: 0
}

async function createApp(nodeEnv: AppConfig['NODE_ENV']) {
  const app = Fastify()
  app.decorate('config', { ...baseConfig, NODE_ENV: nodeEnv })
  await app.register(helmetPlugin)
  await app.ready()
  return app
}

describe('helmetPlugin', () => {
  it('omits content-security-policy header in non-production environments', async () => {
    const devApp = await createApp('development')
    const testApp = await createApp('test')

    const devResponse = await devApp.inject({ method: 'GET', url: '/' })
    const testResponse = await testApp.inject({ method: 'GET', url: '/' })

    expect(devResponse.headers['content-security-policy']).toBeUndefined()
    expect(testResponse.headers['content-security-policy']).toBeUndefined()

    await devApp.close()
    await testApp.close()
  })

  it('enables content-security-policy in production', async () => {
    const app = await createApp('production')
    const response = await app.inject({ method: 'GET', url: '/' })

    expect(response.headers['content-security-policy']).toBeDefined()

    await app.close()
  })

  it('sets common security headers', async () => {
    const app = await createApp('production')
    const response = await app.inject({ method: 'GET', url: '/' })

    expect(response.headers['x-dns-prefetch-control']).toBe('off')
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN')
    expect(response.headers['x-xss-protection']).toBe('0')

    await app.close()
  })

  it('disables COEP/CORP when configured', async () => {
    const app = await createApp('test')
    const response = await app.inject({ method: 'GET', url: '/' })

    expect(response.headers['cross-origin-embedder-policy']).toBeUndefined()
    expect(response.headers['cross-origin-resource-policy']).toBeUndefined()

    await app.close()
  })

  it('keeps COEP/CORP disabled across environments', async () => {
    const app = await createApp('production')
    const response = await app.inject({ method: 'GET', url: '/' })

    expect(response.headers['cross-origin-embedder-policy']).toBeUndefined()
    expect(response.headers['cross-origin-resource-policy']).toBeUndefined()

    await app.close()
  })

  it('does not duplicate headers across requests', async () => {
    const app = await createApp('production')

    const first = await app.inject({ method: 'GET', url: '/' })
    const second = await app.inject({ method: 'GET', url: '/' })

    const headerNames = [
      'x-dns-prefetch-control',
      'x-frame-options',
      'cross-origin-embedder-policy',
      'cross-origin-resource-policy'
    ] as const
    for (const name of headerNames) {
      expect(Array.isArray(first.headers[name])).toBe(false)
      expect(Array.isArray(second.headers[name])).toBe(false)
      expect(first.headers[name]).toBe(second.headers[name])
    }

    await app.close()
  })
})
