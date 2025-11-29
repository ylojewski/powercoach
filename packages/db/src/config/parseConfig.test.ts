import { describe, expect, it } from 'vitest'

import { parseDbConfig } from './parseConfig'

describe('parseDbConfig', () => {
  it('formats the error message when parsing fails', () => {
    expect(() => parseDbConfig({}, (error) => `Failed: ${error.message}`)).toThrow(/Failed:/)
  })
})
