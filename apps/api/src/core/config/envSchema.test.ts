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
        code: 'invalid_value',
        values: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
        path: ['LOG_LEVEL'],
        message:
          'Invalid option: expected one of "fatal"|"error"|"warn"|"info"|"debug"|"trace"|"silent"'
      }),
      expect.objectContaining({
        origin: 'number',
        code: 'too_small',
        minimum: 0,
        inclusive: true,
        path: ['PORT'],
        message: 'Too small: expected number to be >=0'
      })
    ])
  })
})
