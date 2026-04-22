import { sql } from 'drizzle-orm'
import { type NodePgDatabase } from 'drizzle-orm/node-postgres'

export interface IsDatabaseOkRow extends Record<string, unknown> {
  database: number
}

export async function isDatabaseOk(db: NodePgDatabase): Promise<boolean> {
  const {
    rows: [firstRow]
  } = await db.execute<IsDatabaseOkRow>(sql`SELECT 1 as database`)
  return firstRow ? firstRow.database >= 1 : false
}
