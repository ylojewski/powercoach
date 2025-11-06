import { type AjvCompilerOptions } from '@/src/types/ajv'

export const ajvOptions: AjvCompilerOptions = Object.freeze({
  allErrors: true,
  coerceTypes: false,
  removeAdditional: false,
  strict: true,
  useDefaults: false
})
