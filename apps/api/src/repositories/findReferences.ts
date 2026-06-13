import {
  disciplines as disciplinesTable,
  disciplineMovements as disciplineMovementsTable,
  exerciseMuscles as exerciseMusclesTable,
  exerciseRelationships as exerciseRelationshipsTable,
  exerciseRoles as exerciseRolesTable,
  exercises as exercisesTable,
  loadingTypes as loadingTypesTable,
  muscleRoles as muscleRolesTable,
  muscles as musclesTable,
  patterns as patternsTable
} from '@powercoach/db'
import { asc } from 'drizzle-orm'
import { type NodePgDatabase } from 'drizzle-orm/node-postgres'

export interface ReferenceRows {
  disciplines: (typeof disciplinesTable.$inferSelect)[]
  disciplineMovements: (typeof disciplineMovementsTable.$inferSelect)[]
  exerciseMuscles: (typeof exerciseMusclesTable.$inferSelect)[]
  exerciseRelationships: (typeof exerciseRelationshipsTable.$inferSelect)[]
  exerciseRoles: (typeof exerciseRolesTable.$inferSelect)[]
  exercises: (typeof exercisesTable.$inferSelect)[]
  loadingTypes: (typeof loadingTypesTable.$inferSelect)[]
  muscleRoles: (typeof muscleRolesTable.$inferSelect)[]
  muscles: (typeof musclesTable.$inferSelect)[]
  patterns: (typeof patternsTable.$inferSelect)[]
}

export async function findReferences(db: NodePgDatabase): Promise<ReferenceRows> {
  const [
    disciplines,
    disciplineMovements,
    exerciseMuscles,
    exerciseRelationships,
    exerciseRoles,
    exercises,
    loadingTypes,
    muscleRoles,
    muscles,
    patterns
  ] = await Promise.all([
    db.select().from(disciplinesTable).orderBy(asc(disciplinesTable.id)),
    db
      .select()
      .from(disciplineMovementsTable)
      .orderBy(
        asc(disciplineMovementsTable.disciplineId),
        asc(disciplineMovementsTable.sortOrder),
        asc(disciplineMovementsTable.id)
      ),
    db
      .select()
      .from(exerciseMusclesTable)
      .orderBy(asc(exerciseMusclesTable.exerciseId), asc(exerciseMusclesTable.muscleId)),
    db.select().from(exerciseRelationshipsTable).orderBy(asc(exerciseRelationshipsTable.id)),
    db.select().from(exerciseRolesTable).orderBy(asc(exerciseRolesTable.id)),
    db.select().from(exercisesTable).orderBy(asc(exercisesTable.id)),
    db.select().from(loadingTypesTable).orderBy(asc(loadingTypesTable.id)),
    db.select().from(muscleRolesTable).orderBy(asc(muscleRolesTable.id)),
    db.select().from(musclesTable).orderBy(asc(musclesTable.id)),
    db.select().from(patternsTable).orderBy(asc(patternsTable.id))
  ])

  return {
    disciplineMovements,
    disciplines,
    exerciseMuscles,
    exerciseRelationships,
    exerciseRoles,
    exercises,
    loadingTypes,
    muscleRoles,
    muscles,
    patterns
  }
}
