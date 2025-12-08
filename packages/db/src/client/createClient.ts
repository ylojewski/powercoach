import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'

import { loadEnv } from '@/src/core'

export interface CreateClientOptions {
  databaseUrl: string
}

export async function createClient(options?: CreateClientOptions) {
  const pg = new Client({
    connectionString: options?.databaseUrl ?? loadEnv().DATABASE_URL
  })

  try {
    await pg.connect()
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    throw error
  }

  return {
    db: drizzle(pg),
    pg
  }
}
