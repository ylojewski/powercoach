import { type AjvCompilerOptions } from '@/src/types/ajv'

import { ajvOptions } from './ajvOptions'

describe('ajvOptions', () => {
  it('Should return frozen strict options', () => {
    expect(Object.isFrozen(ajvOptions)).toBe(true)
    expect(ajvOptions).toStrictEqual<AjvCompilerOptions>({
      allErrors: true,
      coerceTypes: false,
      removeAdditional: false,
      strict: true,
      useDefaults: false
    })
  })
})
