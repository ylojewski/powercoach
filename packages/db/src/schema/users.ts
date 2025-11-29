import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  email: varchar('email', { length: 255 }).notNull().unique(),
  id: uuid('id').primaryKey().defaultRandom()
})

export type User = typeof users.$inferSelect
