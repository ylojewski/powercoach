import { invalidConfig, productionConfig } from '@test/fixtures/env'
import { ZodError } from 'zod'
import { parseConfig } from './parseConfig'
import { AppConfig } from '@/core'

describe('parseConfig', () => {
  it('succeed parsing a valid configuration', () => {
    const format = vi.fn()
    const config: AppConfig = parseConfig(productionConfig, format)

    expect(config).toStrictEqual<AppConfig>(productionConfig)
    expect(format).not.toHaveBeenCalled()
  })

  it('fails parsing an invalid configuration', () => {
    const format = vi.fn(() => 'custom message')
    expect(() => parseConfig(invalidConfig, format)).toThrowError('custom message')

    expect(format).toHaveBeenCalledOnce()
    expect(format.mock.calls[0]?.pop()).toBeInstanceOf(ZodError)
  })
})
