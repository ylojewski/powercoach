import { sql } from 'drizzle-orm'
import { check, index, integer, pgTable, real, serial, uniqueIndex } from 'drizzle-orm/pg-core'

import { disciplines } from './disciplines'
import { exerciseRoles } from './exerciseRoles'
import { exercises } from './exercises'
import { timestamps } from './timestamps'

export const exerciseRelationships = pgTable(
  'exercise_relationships',
  {
    defaultTransferCoefficient: real('default_transfer_coefficient').notNull(),
    disciplineId: integer('discipline_id')
      .notNull()
      .references(() => disciplines.id),
    id: serial('id').primaryKey(),
    roleId: integer('role_id')
      .notNull()
      .references(() => exerciseRoles.id),
    sourceExerciseId: integer('source_exercise_id')
      .notNull()
      .references(() => exercises.id),
    targetExerciseId: integer('target_exercise_id')
      .notNull()
      .references(() => exercises.id),
    ...timestamps
  },
  (table) => [
    check(
      'exercise_relationships_default_transfer_coefficient_range_check',
      sql`${table.defaultTransferCoefficient} >= 0 AND ${table.defaultTransferCoefficient} <= 1`
    ),
    index('exercise_relationships_discipline_source_idx').on(
      table.disciplineId,
      table.sourceExerciseId
    ),
    index('exercise_relationships_target_role_transfer_idx').on(
      table.disciplineId,
      table.targetExerciseId,
      table.roleId,
      table.defaultTransferCoefficient
    ),
    index('exercise_relationships_role_id_idx').on(table.roleId),
    index('exercise_relationships_source_exercise_id_idx').on(table.sourceExerciseId),
    index('exercise_relationships_target_exercise_id_idx').on(table.targetExerciseId),
    uniqueIndex('exercise_relationships_discipline_source_target_unique').on(
      table.disciplineId,
      table.sourceExerciseId,
      table.targetExerciseId
    )
  ]
)
