import { sql } from 'drizzle-orm'

import { type AppFastifyInstance } from '@/src/app'

export interface IsOkQueryRow extends Record<string, unknown> {
  database: number
}

export async function isOkQuery({ db }: AppFastifyInstance): Promise<boolean> {
  const {
    rows: [firstRow]
  } = await db.execute<IsOkQueryRow>(sql`SELECT 1 as database`)
  return firstRow ? firstRow.database >= 1 : false
}
