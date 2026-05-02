import { sql } from 'drizzle-orm'
import { check, index, integer, pgTable, primaryKey, real } from 'drizzle-orm/pg-core'

import { exercises } from './exercises'
import { muscleRoles } from './muscleRoles'
import { muscles } from './muscles'

export const exerciseMuscles = pgTable(
  'exercise_muscles',
  {
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id),
    muscleId: integer('muscle_id')
      .notNull()
      .references(() => muscles.id),
    muscleRoleId: integer('muscle_role_id')
      .notNull()
      .references(() => muscleRoles.id),
    weightPercentage: real('weight_percentage').notNull()
  },
  (table) => [
    check(
      'exercise_muscles_weight_percentage_range_check',
      sql`${table.weightPercentage} >= 0 AND ${table.weightPercentage} <= 100`
    ),
    index('exercise_muscles_muscle_id_muscle_role_id_idx').on(table.muscleId, table.muscleRoleId),
    primaryKey({ columns: [table.exerciseId, table.muscleId] })
  ]
)
