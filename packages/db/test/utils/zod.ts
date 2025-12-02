import { ZodError, ZodObject } from 'zod'

export function expectZodParseToThrow(schema: ZodObject, values: unknown): ZodError {
  let zodError = new ZodError([])

  expect(() => {
    try {
      schema.parse(values)
    } catch (error) {
      zodError = error as ZodError
      throw error
    }
  }).toThrowError(ZodError)

  return zodError
}
