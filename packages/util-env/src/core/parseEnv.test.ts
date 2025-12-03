import { z, ZodError } from 'zod'

import { invalidConfig, productionConfig } from '@/test/fixtures'

import { type Env, envSchema } from './envSchema'
import { parseEnv } from './parseEnv'

describe('parseEnv', () => {
  it('succeed parsing a valid basic configuration', () => {
    const format = vi.fn()
    const config: Env = parseEnv(envSchema, productionConfig, format)

    expect(config).toStrictEqual<Env>(productionConfig)
    expect(format).not.toHaveBeenCalled()
  })

  it('succeed parsing a valid custom configuration', () => {
    const customSchema = envSchema.extend({ CUSTOM: z.string() })
    const customConfig = { ...productionConfig, CUSTOM: 'custom' }
    type CustomEnv = z.infer<typeof customSchema>

    const format = vi.fn()
    const config: CustomEnv = parseEnv(customSchema, customConfig, format)

    expect(config).toStrictEqual<CustomEnv>({ ...productionConfig, CUSTOM: 'custom' })
    expect(format).not.toHaveBeenCalled()
  })

  it('fails parsing an invalid base configuration', () => {
    const format = vi.fn(() => 'custom message')
    expect(() => parseEnv(envSchema, invalidConfig, format)).toThrowError('custom message')

    expect(format).toHaveBeenCalledOnce()
    expect(format.mock.calls[0]?.pop()).toBeInstanceOf(ZodError)
  })

  it('fails parsing an invalid custom configuration', () => {
    const customSchema = envSchema.extend({ UUID: z.uuid() })
    const customConfig = { ...productionConfig, UUID: 42 }

    const format = vi.fn(() => 'custom message')
    expect(() => parseEnv(customSchema, customConfig, format)).toThrowError('custom message')

    expect(format).toHaveBeenCalledOnce()
    expect(format.mock.calls[0]?.pop()).toBeInstanceOf(ZodError)
  })
})
