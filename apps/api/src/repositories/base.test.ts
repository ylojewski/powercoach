import { mockQueryResult } from '@powercoach/util-test'
import { type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { type FastifyInstance } from 'fastify'
import { type MockedFunction } from 'vitest'

import { buildDummyApp } from '@/test/utils'

import { isOkQuery, type IsOkQueryRow } from './base'

describe('base', () => {
  let dummyApp: FastifyInstance
  let executeMock: MockedFunction<NodePgDatabase['execute']>

  beforeAll(async () => {
    dummyApp = await buildDummyApp({ withDb: true })
    executeMock = dummyApp.db.execute as MockedFunction<NodePgDatabase['execute']>
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    await dummyApp.close()
  })

  describe('isOkQuery', () => {
    it('throws if db execution fails', async () => {
      executeMock.mockRejectedValueOnce(new Error('execute'))
      await expect(isOkQuery(dummyApp)).rejects.toThrow(/execute/)
    })
    it('returns false if no rows', async () => {
      executeMock.mockResolvedValueOnce(mockQueryResult<IsOkQueryRow>([]))
      await expect(isOkQuery(dummyApp)).resolves.toBe(false)
    })
    it('returns false if select failed', async () => {
      executeMock.mockResolvedValueOnce(mockQueryResult<IsOkQueryRow>([{ database: 0 }]))
      await expect(isOkQuery(dummyApp)).resolves.toBe(false)
    })
    it('returns true', async () => {
      executeMock.mockResolvedValueOnce(mockQueryResult<IsOkQueryRow>([{ database: 1 }]))
      executeMock.mockResolvedValueOnce(mockQueryResult<IsOkQueryRow>([{ database: 2 }]))
      await expect(isOkQuery(dummyApp)).resolves.toBe(true)
      await expect(isOkQuery(dummyApp)).resolves.toBe(true)
    })
  })
})
