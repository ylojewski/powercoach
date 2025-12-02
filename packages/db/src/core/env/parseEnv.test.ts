import { ZodError } from 'zod'

import { invalidConfig, productionConfig } from '@/test/fixtures'

import { Env } from './envSchema'
import { parseEnv } from './parseEnv'

describe('parseEnv', () => {
  it('succeed parsing a valid configuration', () => {
    const format = vi.fn()
    const config: Env = parseEnv(productionConfig, format)

    expect(config).toStrictEqual<Env>(productionConfig)
    expect(format).not.toHaveBeenCalled()
  })

  it('fails parsing an invalid configuration', () => {
    const format = vi.fn(() => 'custom message')
    expect(() => parseEnv(invalidConfig, format)).toThrowError('custom message')

    expect(format).toHaveBeenCalledOnce()
    expect(format.mock.calls[0]?.pop()).toBeInstanceOf(ZodError)
  })
})
