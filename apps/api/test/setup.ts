import { randomUUID } from 'node:crypto'

import { execa } from 'execa'
import { Client } from 'pg'
import { inject } from 'vitest'

const testDatabaseName = `test_${randomUUID()}` as const
let testClient: Client

beforeAll(async () => {
  const databaseUrl = inject('databaseUrl')
  const client = new Client({ connectionString: databaseUrl })

  await client.connect()
  await client.query(`CREATE DATABASE "${testDatabaseName}"`)
  await client.end()

  const testDatabaseUrl = databaseUrl.replace(/\/[^/]+$/, `/${testDatabaseName}`)

  testClient = new Client({ connectionString: testDatabaseUrl })
  vi.stubEnv('DATABASE_URL', testDatabaseUrl)

  await execa('pnpm', ['--filter', '@powercoach/db', 'migrate'], { env: process.env })
  await execa('pnpm', ['--filter', '@powercoach/db', 'seed'], { env: process.env })
})

afterAll(async () => {
  await testClient.end()

  const adminClient = new Client({ connectionString: inject('databaseUrl') })

  await adminClient.connect()
  await adminClient.query(`DROP DATABASE IF EXISTS "${testDatabaseName}"`)
  await adminClient.end()
})
