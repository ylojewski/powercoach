import { ZodError } from 'zod'
import { envSchema } from './envSchema'

describe('envSchema', () => {
  it('applies defaults when variables are missing', () => {
    const result = envSchema.parse({})

    expect(result).toEqual({
      HOST: '0.0.0.0',
      LOG_LEVEL: 'info',
      NODE_ENV: 'development',
      PORT: 3000
    })
  })

  it('rejects invalid values', () => {
    const invalidEnvironment = {
      HOST: '0.0.0.0',
      LOG_LEVEL: 'verbose',
      NODE_ENV: 'development',
      PORT: -1
    } as const

    let thrown: unknown

    expect(() => {
      try {
        envSchema.parse(invalidEnvironment)
      } catch (error) {
        thrown = error
        throw error
      }
    }).toThrowError(ZodError)

    expect(thrown).toBeInstanceOf(ZodError)
    expect((thrown as ZodError).issues).toEqual([
      expect.objectContaining({
        code: 'invalid_enum_value',
        options: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
        path: ['LOG_LEVEL'],
        received: 'verbose'
      }),
      expect.objectContaining({
        code: 'too_small',
        minimum: 0,
        path: ['PORT'],
        type: 'number'
      })
    ])
  })
})
