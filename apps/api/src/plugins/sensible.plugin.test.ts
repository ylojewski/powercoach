import { createEmptyApp } from '@test/utils/app'
import { FastifyInstance } from 'fastify'
import { afterAll, beforeAll } from 'vitest'
import { sensiblePlugin } from './sensible.plugin'

describe('sensiblePlugin', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = createEmptyApp()
    await app.register(sensiblePlugin)
  })

  afterAll(async () => {
    await app.close()
  })

  it('provides some sensible decorators', async () => {
    expect(app.hasDecorator('httpErrors')).toBe(true)
  })

  it('uses the notFound sesible response', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/not-found'
    })

    expect(response.statusCode).toBe(404)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.json()).toStrictEqual({
      error: 'Not Found',
      message: 'Route GET:/not-found not found',
      statusCode: 404
    })
  })
})
