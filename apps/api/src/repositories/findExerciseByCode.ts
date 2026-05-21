import { exercises as exercisesTable } from '@powercoach/db'
import { eq } from 'drizzle-orm'
import { type NodePgDatabase } from 'drizzle-orm/node-postgres'

export type ExerciseRow = typeof exercisesTable.$inferSelect

export async function findExerciseByCode(
  db: NodePgDatabase,
  code: string
): Promise<ExerciseRow | null> {
  const [exercise] = await db.select().from(exercisesTable).where(eq(exercisesTable.code, code))
  return exercise ?? null
}
