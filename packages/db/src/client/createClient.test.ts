import { spyOnConsole } from '@powercoach/util-test'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import { type MockedFunction } from 'vitest'

import { createClient } from '@/src/client'
import { loadEnv } from '@/src/core'

vi.mock('pg', () => ({
  Client: vi.fn().mockImplementation(function Client(this: Client) {
    this.connect = vi.fn()
  })
}))

vi.mock('drizzle-orm/node-postgres', () => ({
  drizzle: vi.fn(() => ({ fakeDb: true }))
}))

vi.mock('@/src/core', () => ({
  loadEnv: vi.fn(() => ({
    DATABASE_URL: 'postgres://user:pass@localhost:5432/loadenv_db'
  }))
}))

const ClientMock = Client as MockedFunction<typeof Client>
const loadEnvMock = loadEnv as MockedFunction<typeof loadEnv>

spyOnConsole(['log', 'error'])

describe('createClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('creates a pg client, connects and returns { db, pg } using the environment database URL', async () => {
    const result = await createClient()

    expect(ClientMock).toHaveBeenCalledWith({
      connectionString: 'postgres://user:pass@localhost:5432/loadenv_db'
    })
    expect(ClientMock).toHaveBeenCalledTimes(1)
    expect(loadEnvMock).toHaveBeenCalledTimes(1)
    expect(drizzle).toHaveBeenCalledWith(ClientMock.mock.instances[0])
    expect(result).toStrictEqual({
      db: { fakeDb: true },
      pg: ClientMock.mock.instances[0]
    })
  })

  it('creates a pg client, connects and returns { db, pg } using the passed database URL', async () => {
    const result = await createClient({
      databaseUrl: 'postgres://user:pass@localhost:5432/given_db'
    })

    expect(ClientMock).toHaveBeenCalledWith({
      connectionString: 'postgres://user:pass@localhost:5432/given_db'
    })
    expect(ClientMock).toHaveBeenCalledTimes(1)
    expect(loadEnvMock).not.toHaveBeenCalled()
    expect(drizzle).toHaveBeenCalledWith(ClientMock.mock.instances[0])
    expect(result).toStrictEqual({
      db: { fakeDb: true },
      pg: ClientMock.mock.instances[0]
    })
  })

  it('throws an error if connection fails', async () => {
    ClientMock.mockImplementationOnce(function Client(this: Client) {
      this.connect = vi.fn().mockRejectedValue(new Error('connection failed'))
    })
    await expect(createClient()).rejects.toThrow('connection failed')
  })
})
