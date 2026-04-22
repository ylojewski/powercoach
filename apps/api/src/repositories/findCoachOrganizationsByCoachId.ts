import { coachOrganizations, organizations } from '@powercoach/db'
import { asc, eq, inArray } from 'drizzle-orm'
import { type NodePgDatabase } from 'drizzle-orm/node-postgres'

export async function findCoachOrganizationsByCoachId(
  db: NodePgDatabase,
  coachId: number
): Promise<(typeof organizations.$inferSelect)[]> {
  const coachOrganizationIds = db
    .select({ organizationId: coachOrganizations.organizationId })
    .from(coachOrganizations)
    .where(eq(coachOrganizations.coachId, coachId))

  return db
    .select()
    .from(organizations)
    .where(inArray(organizations.id, coachOrganizationIds))
    .orderBy(asc(organizations.id))
}
