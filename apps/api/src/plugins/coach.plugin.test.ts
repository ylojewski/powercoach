import { GHOST_COACH_EMAIL, COACH_EMAIL, COACH_ROW } from '@powercoach/util-fixture'

import { type AppFastifyInstance } from '@/src/app'
import { type AppTestOptions, appTest, buildDummyApp } from '@/test/utils'

import {
  COACH_EMAIL_HEADER,
  COACH_PLUGIN_NAME,
  coachPlugin,
  getCoachEmailHeader
} from './coach.plugin'

const appTestOptions = {
  beforeReady: async (app: AppFastifyInstance): Promise<void> => {
    await app.register(coachPlugin)
    app.get('/coach', async ({ coach }) => coach)
  }
} satisfies AppTestOptions

describe('getCoachEmailHeader', () => {
  it('returns the trimmed email when the header is provided as a string', () => {
    expect(getCoachEmailHeader(` ${COACH_EMAIL} `)).toBe(COACH_EMAIL)
  })

  it('returns null when the header is empty', () => {
    expect(getCoachEmailHeader('   ')).toBeNull()
  })

  it('returns null when the header is missing', () => {
    expect(getCoachEmailHeader(undefined)).toBeNull()
  })

  it('returns null when the provided header is not a string', () => {
    expect(getCoachEmailHeader([COACH_EMAIL])).toBeNull()
  })
})

describe('coachPlugin', () => {
  it('exposes a custom name', () => {
    expect(COACH_PLUGIN_NAME).toBe('powercoach.coach.plugin')
  })

  it('exposes a custom "coach" request decorator', async () => {
    const app = await buildDummyApp({ plugins: [coachPlugin] })

    try {
      expect(app.hasRequestDecorator('coach')).toBe(true)
    } finally {
      await app.close()
    }
  })

  appTest(
    'decorates the request with the coach row',
    async ({ app }) => {
      const response = await app.inject({
        headers: { [COACH_EMAIL_HEADER]: COACH_EMAIL },
        method: 'GET',
        url: '/coach'
      })

      expect(response.statusCode).toBe(200)
      expect(response.json()).toStrictEqual({
        ...COACH_ROW,
        id: expect.any(Number)
      })
    },
    appTestOptions
  )

  appTest(
    'returns unauthorized when the coach email header is missing',
    async ({ app }) => {
      const response = await app.inject({ method: 'GET', url: '/coach' })

      expect(response.statusCode).toBe(401)
      expect(response.json()).toMatchObject({
        error: 'Unauthorized',
        message: `Missing "${COACH_EMAIL_HEADER}" header`,
        statusCode: 401
      })
    },
    appTestOptions
  )

  appTest(
    'returns unauthorized when the coach does not exist',
    async ({ app }) => {
      const response = await app.inject({
        headers: { [COACH_EMAIL_HEADER]: GHOST_COACH_EMAIL },
        method: 'GET',
        url: '/coach'
      })

      expect(response.statusCode).toBe(401)
      expect(response.json()).toMatchObject({
        error: 'Unauthorized',
        message: `Coach "${GHOST_COACH_EMAIL}" not found`,
        statusCode: 401
      })
    },
    appTestOptions
  )
})
