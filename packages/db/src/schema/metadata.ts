import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const metadata = pgTable('metadata', {
  id: serial('id').primaryKey(),
  key: text('key').notNull(),
  value: text('value').notNull()
})
