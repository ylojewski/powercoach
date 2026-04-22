import { athletes } from '@powercoach/db'
import { and, asc, eq } from 'drizzle-orm'
import { type NodePgDatabase } from 'drizzle-orm/node-postgres'

export async function findAthletesByCoachIdAndOrganizationId(
  db: NodePgDatabase,
  coachId: number,
  organizationId: number
): Promise<(typeof athletes.$inferSelect)[]> {
  return db
    .select()
    .from(athletes)
    .where(and(eq(athletes.coachId, coachId), eq(athletes.organizationId, organizationId)))
    .orderBy(asc(athletes.id))
}
