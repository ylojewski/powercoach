import { sql } from 'drizzle-orm'
import { check, foreignKey, index, integer, pgTable, serial, text } from 'drizzle-orm/pg-core'

import { timestamps } from './timestamps'

export const muscles = pgTable(
  'muscles',
  {
    chain: text('chain'),
    code: text('code').notNull().unique(),
    commonName: text('common_name'),
    description: text('description').notNull(),
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    parentMuscleId: integer('parent_muscle_id'),
    ...timestamps
  },
  (table) => [
    check(
      'muscles_chain_check',
      sql`${table.chain} IS NULL OR ${table.chain} IN ('anterior', 'posterior')`
    ),
    foreignKey({
      columns: [table.parentMuscleId],
      foreignColumns: [table.id],
      name: 'muscles_parent_muscle_id_fk'
    }),
    index('muscles_parent_muscle_id_idx').on(table.parentMuscleId)
  ]
)
