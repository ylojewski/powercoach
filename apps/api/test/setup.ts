import { randomUUID } from 'node:crypto'

import { execa } from 'execa'
import { Client } from 'pg'
import { inject } from 'vitest'

const testDatabaseName = `test_${randomUUID()}` as const
let testClient: Client

beforeAll(async () => {
  const adminDatabaseUrl = inject('adminDatabaseUrl')
  const adminClient = new Client({ connectionString: adminDatabaseUrl })

  await adminClient.connect()
  await adminClient.query(`CREATE DATABASE "${testDatabaseName}"`)
  await adminClient.end()

  const testDatabaseUrl = adminDatabaseUrl.replace(/\/[^/]+$/, `/${testDatabaseName}`)

  testClient = new Client({ connectionString: testDatabaseUrl })
  vi.stubEnv('DATABASE_URL', testDatabaseUrl)

  await execa('pnpm', ['--filter', '@powercoach/db', 'db:migrate'], { env: process.env })
  await execa('pnpm', ['--filter', '@powercoach/db', 'db:seed'], { env: process.env })
})

afterAll(async () => {
  await testClient.end()
})
