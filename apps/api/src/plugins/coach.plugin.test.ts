import { type FastifyInstance } from 'fastify'
import { type Mock } from 'vitest'

import { buildDummyApp } from '@/test/utils'

import {
  COACH_EMAIL_HEADER,
  COACH_PLUGIN_NAME,
  coachPlugin,
  getCoachEmailHeader
} from './coach.plugin'
import { sensiblePlugin } from './sensible.plugin'

function mockCoachLookup(app: FastifyInstance, coach: Record<string, unknown>[]) {
  ;(app.db.select as unknown as Mock).mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue(coach)
      })
    })
  })
}

describe('getCoachEmailHeader', () => {
  it('returns the trimmed email when the header is provided as a string', () => {
    expect(getCoachEmailHeader(' astra.quill@example.test ')).toBe('astra.quill@example.test')
  })
  it('returns null when the header is empty', () => {
    expect(getCoachEmailHeader('   ')).toBeNull()
  })
  it('returns null when the header is missing', () => {
    expect(getCoachEmailHeader(undefined)).toBeNull()
  })
  it('returns null when the provided header is not a string', () => {
    expect(getCoachEmailHeader(['astra.quill@example.test'])).toBeNull()
  })
})

describe('coachPlugin', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = await buildDummyApp({
      plugins: [sensiblePlugin, coachPlugin],
      ready: false,
      withDb: true
    })

    app.get('/coach', async (request) => request.coach)
  })

  afterEach(async () => {
    vi.resetAllMocks()
    await app.close()
  })

  it('exposes a custom name', () => {
    expect(COACH_PLUGIN_NAME).toBe('powercoach.coach.plugin')
  })

  it('exposes a custom "coach" request decorator', () => {
    expect(app.hasRequestDecorator('coach')).toBe(true)
  })

  it('decorates the request with the coach row', async () => {
    mockCoachLookup(app, [
      {
        email: 'astra.quill@example.test',
        firstName: 'Astra',
        id: 10,
        lastName: 'Quill',
        password: 'powercoach-demo'
      }
    ])

    await app.ready()

    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: 'astra.quill@example.test' },
      method: 'GET',
      url: '/coach'
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toStrictEqual({
      email: 'astra.quill@example.test',
      firstName: 'Astra',
      id: 10,
      lastName: 'Quill',
      password: 'powercoach-demo'
    })
  })

  it('returns unauthorized when the coach email header is missing', async () => {
    await app.ready()

    const response = await app.inject({ method: 'GET', url: '/coach' })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toMatchObject({
      error: 'Unauthorized',
      message: `Missing "${COACH_EMAIL_HEADER}" header`,
      statusCode: 401
    })
  })

  it('returns unauthorized when the coach does not exist', async () => {
    mockCoachLookup(app, [])

    await app.ready()

    const response = await app.inject({
      headers: { [COACH_EMAIL_HEADER]: 'ghost.coach@example.test' },
      method: 'GET',
      url: '/coach'
    })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toMatchObject({
      error: 'Unauthorized',
      message: 'Coach "ghost.coach@example.test" not found',
      statusCode: 401
    })
  })
})
