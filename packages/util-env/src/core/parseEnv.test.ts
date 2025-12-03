import { z, ZodError } from 'zod'

import { invalidEnv, productionEnv } from '@/test/fixtures'

import { type Env, envSchema } from './envSchema'
import { parseEnv } from './parseEnv'

describe('parseEnv', () => {
  it('succeed parsing a valid basic configuration', () => {
    const format = vi.fn()
    const env: Env = parseEnv(envSchema, productionEnv, format)

    expect(env).toStrictEqual<Env>(productionEnv)
    expect(format).not.toHaveBeenCalled()
  })

  it('succeed parsing a valid custom configuration', () => {
    const customSchema = envSchema.extend({ CUSTOM: z.string() })
    const customEnv = { ...productionEnv, CUSTOM: 'custom' }
    type CustomEnv = z.infer<typeof customSchema>

    const format = vi.fn()
    const env: CustomEnv = parseEnv(customSchema, customEnv, format)

    expect(env).toStrictEqual<CustomEnv>({ ...productionEnv, CUSTOM: 'custom' })
    expect(format).not.toHaveBeenCalled()
  })

  it('fails parsing an invalid base configuration', () => {
    const format = vi.fn(() => 'custom message')
    expect(() => parseEnv(envSchema, invalidEnv, format)).toThrowError('custom message')

    expect(format).toHaveBeenCalledOnce()
    expect(format.mock.calls[0]?.pop()).toBeInstanceOf(ZodError)
  })

  it('fails parsing an invalid custom configuration', () => {
    const customSchema = envSchema.extend({ UUID: z.uuid() })
    const customEnv = { ...productionEnv, UUID: 42 }

    const format = vi.fn(() => 'custom message')
    expect(() => parseEnv(customSchema, customEnv, format)).toThrowError('custom message')

    expect(format).toHaveBeenCalledOnce()
    expect(format.mock.calls[0]?.pop()).toBeInstanceOf(ZodError)
  })
})
