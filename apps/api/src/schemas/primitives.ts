import { Type, type TSchema } from '@sinclair/typebox'

export const timestampSchema = Type.String({ format: 'date-time' })

export function nullable<T extends TSchema>(schema: T) {
  return Type.Union([schema, Type.Null()])
}
