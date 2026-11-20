import { pgTable, serial, text } from 'drizzle-orm/pg-core'

import { timestamps } from './timestamps'

export const patterns = pgTable('patterns', {
  code: text('code').notNull().unique(),
  description: text('description').notNull(),
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ...timestamps
})
