import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import { loadDbConfig, parseDbConfig, type DbConfig } from './config'
import { users, type User } from './schema'

export type DbClient = ReturnType<typeof drizzle>

export const fallbackUser: User = {
  email: 'demo@power.coach',
  id: '00000000-0000-4000-8000-000000000000'
}

export function createDb(config?: DbConfig): DbClient {
  const resolvedConfig = config
    ? parseDbConfig(config, (error) => `Invalid database configuration: ${error.message}`)
    : loadDbConfig()
  const sql = neon(resolvedConfig.DATABASE_URL)

  return drizzle(sql, { schema: { users } })
}

export async function fetchFirstUser(db: DbClient = createDb()): Promise<User> {
  const [user] = await db.select().from(users).limit(1)

  return user ?? fallbackUser
}
