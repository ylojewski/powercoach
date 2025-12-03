import { spyOnConsole } from '@powercoach/util-test'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import { type MockedFunction } from 'vitest'

import { createClient } from '@/src/client'

const ClientMock = Client as MockedFunction<typeof Client>

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
    DATABASE_URL: 'postgres://user:pass@localhost:5432/db'
  }))
}))

spyOnConsole(['log', 'error'])

describe('createClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('creates a pg client, connects and returns { db, pg }', async () => {
    const result = await createClient()

    expect(ClientMock).toHaveBeenCalledWith({
      connectionString: 'postgres://user:pass@localhost:5432/db'
    })
    expect(ClientMock).toHaveBeenCalledTimes(1)
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
