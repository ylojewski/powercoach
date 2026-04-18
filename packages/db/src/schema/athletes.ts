import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'

import { coaches } from './coaches'

export const athletes = pgTable('athletes', {
  coachId: integer('coach_id')
    .notNull()
    .references(() => coaches.id),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  id: serial('id').primaryKey(),
  lastName: text('last_name').notNull(),
  password: text('password').notNull()
})
