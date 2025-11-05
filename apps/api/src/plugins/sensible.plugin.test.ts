import { buildDummyApp } from '@test/utils/app'
import { FastifyInstance } from 'fastify'
import { sensiblePlugin } from './sensible.plugin'

describe('sensiblePlugin', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildDummyApp({
      ready: false,
      plugins: [sensiblePlugin]
    })
    app.get('/forbidden', () => app.httpErrors.forbidden('forbidden'))
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('provides sensible decorators', async () => {
    expect(app.hasDecorator('httpErrors')).toBe(true)
  })

  it('provides sensible replies', async () => {
    const response = await app.inject({ method: 'GET', url: '/forbidden' })

    expect(response.statusCode).toBe(403)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.json()).toStrictEqual({
      error: 'Forbidden',
      message: 'forbidden',
      statusCode: 403
    })
  })
})
