import { index, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { athletes } from './athletes'
import { disciplines } from './disciplines'

export const athleteDisciplines = pgTable(
  'athlete_disciplines',
  {
    athleteId: integer('athlete_id')
      .notNull()
      .references(() => athletes.id),
    disciplineId: integer('discipline_id')
      .notNull()
      .references(() => disciplines.id)
  },
  (table) => [
    index('athlete_disciplines_discipline_id_idx').on(table.disciplineId),
    primaryKey({ columns: [table.athleteId, table.disciplineId] })
  ]
)
