import { coachSettings } from '@powercoach/db'
import { eq } from 'drizzle-orm'
import { type NodePgDatabase } from 'drizzle-orm/node-postgres'

export async function findCoachSettingsByCoachId(
  db: NodePgDatabase,
  coachId: number
): Promise<typeof coachSettings.$inferSelect | null> {
  const [settings] = await db
    .select()
    .from(coachSettings)
    .where(eq(coachSettings.coachId, coachId))
    .limit(1)

  return settings ?? null
}
