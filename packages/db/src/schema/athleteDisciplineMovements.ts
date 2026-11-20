import { foreignKey, index, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { athleteDisciplines } from './athleteDisciplines'
import { athletes } from './athletes'
import { disciplineMovements } from './disciplineMovements'
import { disciplines } from './disciplines'
import { exercises } from './exercises'

export const athleteDisciplineMovements = pgTable(
  'athlete_discipline_movements',
  {
    athleteId: integer('athlete_id')
      .notNull()
      .references(() => athletes.id),
    disciplineId: integer('discipline_id')
      .notNull()
      .references(() => disciplines.id),
    disciplineMovementId: integer('discipline_movement_id')
      .notNull()
      .references(() => disciplineMovements.id),
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id)
  },
  (table) => [
    foreignKey({
      columns: [table.athleteId, table.disciplineId],
      foreignColumns: [athleteDisciplines.athleteId, athleteDisciplines.disciplineId],
      name: 'athlete_discipline_movements_athlete_discipline_fk'
    }),
    foreignKey({
      columns: [table.disciplineMovementId, table.disciplineId],
      foreignColumns: [disciplineMovements.id, disciplineMovements.disciplineId],
      name: 'athlete_discipline_movements_movement_discipline_fk'
    }),
    index('athlete_discipline_movements_exercise_id_idx').on(table.exerciseId),
    index('athlete_discipline_movements_discipline_id_idx').on(table.disciplineId),
    primaryKey({ columns: [table.athleteId, table.disciplineMovementId] })
  ]
)
