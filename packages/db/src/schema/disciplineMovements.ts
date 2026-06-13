import { index, integer, pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core'

import { disciplines } from './disciplines'

export const disciplineMovements = pgTable(
  'discipline_movements',
  {
    code: text('code').notNull(),
    description: text('description').notNull(),
    disciplineId: integer('discipline_id')
      .notNull()
      .references(() => disciplines.id),
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    sortOrder: integer('sort_order').notNull()
  },
  (table) => [
    index('discipline_movements_discipline_id_idx').on(table.disciplineId),
    uniqueIndex('discipline_movements_discipline_id_code_unique').on(
      table.disciplineId,
      table.code
    ),
    uniqueIndex('discipline_movements_id_discipline_id_unique').on(table.id, table.disciplineId)
  ]
)
