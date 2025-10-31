import { describe, expect, it } from 'vitest'
import { envSchema } from '../../src/core/config/envSchema'

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
})
