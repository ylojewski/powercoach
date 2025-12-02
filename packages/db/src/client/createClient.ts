import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'

import { loadEnv } from '@/src/core'

export async function createClient() {
  const { DATABASE_URL } = loadEnv()
  const pg = new Client({
    connectionString: DATABASE_URL
  })

  try {
    await pg.connect()
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    throw error
  }

  const db = drizzle(pg)

  return {
    db,
    pg
  }
}
