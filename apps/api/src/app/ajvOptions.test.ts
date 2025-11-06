import { Options } from '@fastify/ajv-compiler'

import { ajvOptions } from './ajvOptions'

describe('ajvOptions', () => {
  it('Should return frozen strict options', () => {
    expect(Object.isFrozen(ajvOptions)).toBe(true)
    expect(ajvOptions).toStrictEqual<Options>({
      allErrors: true,
      coerceTypes: false,
      removeAdditional: false,
      strict: true,
      useDefaults: false
    })
  })
})
