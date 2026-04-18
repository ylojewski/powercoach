import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const coaches = pgTable('coaches', {
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  id: serial('id').primaryKey(),
  lastName: text('last_name').notNull(),
  password: text('password').notNull()
})
