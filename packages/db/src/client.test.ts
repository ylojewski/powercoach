import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createDb, fallbackUser, fetchFirstUser } from './client'
import * as dbConfig from './config'
import { type DbConfig } from './config'

vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => 'sql-client')
}))

vi.mock('drizzle-orm/neon-http', () => ({
  drizzle: vi.fn(() => ({
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        limit: vi.fn(async () => [
          {
            email: 'existing@power.coach',
            id: '11111111-1111-4111-8111-111111111111'
          }
        ])
      }))
    }))
  }))
}))

describe('client', () => {
  const validConfig: DbConfig = {
    DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/powercoach'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a drizzle client using the provided configuration', () => {
    const db = createDb(validConfig)

    expect(dbConfig.parseDbConfig(validConfig, (error) => error.message)).toStrictEqual(validConfig)
    expect(neon).toHaveBeenCalledWith(validConfig.DATABASE_URL)
    expect(drizzle).toHaveBeenCalledWith('sql-client', expect.any(Object))
    expect(db).toHaveProperty('select')
  })

  it('fails to create a drizzle client when configuration is invalid', () => {
    expect(() => createDb({ DATABASE_URL: '' } as DbConfig)).toThrow(
      /Invalid database configuration: /
    )
  })

  it('loads configuration from the environment when none is provided', () => {
    const loadSpy = vi.spyOn(dbConfig, 'loadDbConfig').mockReturnValue(validConfig)

    createDb()

    expect(loadSpy).toHaveBeenCalledTimes(1)
  })

  it('fetches the first user and falls back when none is found', async () => {
    const loadedDb = createDb(validConfig)
    const user = await fetchFirstUser(loadedDb)

    expect(user).toMatchObject({
      email: 'existing@power.coach',
      id: '11111111-1111-4111-8111-111111111111'
    })

    const emptySelect = vi.fn(() => ({
      from: vi.fn(() => ({
        limit: vi.fn(async () => [])
      }))
    }))

    const fallbackUserResult = await fetchFirstUser({
      select: emptySelect
    } as unknown as ReturnType<typeof createDb>)

    expect(fallbackUserResult).toStrictEqual(fallbackUser)
  })

  it('creates a client when none is provided', async () => {
    vi.stubEnv('DATABASE_URL', validConfig.DATABASE_URL)
    vi.spyOn(dbConfig, 'loadDbConfig').mockReturnValue(validConfig)

    const emptySelect = vi.fn(() => ({
      from: vi.fn(() => ({
        limit: vi.fn(async () => [])
      }))
    }))

    vi.mocked(drizzle).mockReturnValue({ select: emptySelect } as unknown as ReturnType<
      typeof drizzle
    >)

    const user = await fetchFirstUser()

    expect(user).toStrictEqual(fallbackUser)
    expect(drizzle).toHaveBeenCalled()
  })
})
