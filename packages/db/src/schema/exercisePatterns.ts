import { index, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { exercises } from './exercises'
import { patterns } from './patterns'

export const exercisePatterns = pgTable(
  'exercise_patterns',
  {
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id),
    patternId: integer('pattern_id')
      .notNull()
      .references(() => patterns.id)
  },
  (table) => [
    index('exercise_patterns_pattern_id_idx').on(table.patternId),
    primaryKey({ columns: [table.exerciseId, table.patternId] })
  ]
)
