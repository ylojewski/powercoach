export interface AjvCompilerOptions {
  allErrors: boolean
  coerceTypes: boolean | 'array'
  removeAdditional: boolean | 'all' | 'failing'
  strict: boolean
  useDefaults: boolean
}
