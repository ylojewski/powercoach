import { type Options } from '@fastify/ajv-compiler'

export const ajvOptions: Options = Object.freeze({
  allErrors: true,
  coerceTypes: false,
  removeAdditional: false,
  strict: true,
  useDefaults: false
})
