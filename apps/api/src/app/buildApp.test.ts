import { describe, expect, it } from 'vitest'
import { buildApp } from './buildApp'

describe('buildApp security configuration', () => {
  it('applies helmet security headers to responses', async () => {
    const app = await buildApp({
      config: {
        HOST: '127.0.0.1',
        LOG_LEVEL: 'silent',
        NODE_ENV: 'test',
        PORT: 0
      }
    })

    await app.ready()

    try {
      const response = await app.inject({ method: 'GET', url: '/v1/health' })

      expect(response.statusCode).toBe(200)
      expect(response.headers['x-dns-prefetch-control']).toBe('off')
    } finally {
      await app.close()
    }
  })
})
