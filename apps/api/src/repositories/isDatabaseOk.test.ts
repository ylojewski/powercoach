import { createQueryResultRows } from '@powercoach/util-test'
import { type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { type FastifyInstance } from 'fastify'
import { type MockedFunction } from 'vitest'

import { buildDummyApp } from '@/test/utils'

import { isDatabaseOk, type IsDatabaseOkRow } from './isDatabaseOk'

describe('isDatabaseOk repository', () => {
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

  describe('isDatabaseOk', () => {
    it('throws if db execution fails', async () => {
      executeMock.mockRejectedValueOnce(new Error('execute'))
      await expect(isDatabaseOk(dummyApp.db)).rejects.toThrow(/execute/)
    })
    it('returns false if no rows', async () => {
      executeMock.mockResolvedValueOnce(createQueryResultRows<IsDatabaseOkRow>([]))
      await expect(isDatabaseOk(dummyApp.db)).resolves.toBe(false)
    })
    it('returns false if select failed', async () => {
      executeMock.mockResolvedValueOnce(createQueryResultRows<IsDatabaseOkRow>([{ database: 0 }]))
      await expect(isDatabaseOk(dummyApp.db)).resolves.toBe(false)
    })
    it('returns true', async () => {
      executeMock.mockResolvedValueOnce(createQueryResultRows<IsDatabaseOkRow>([{ database: 1 }]))
      executeMock.mockResolvedValueOnce(createQueryResultRows<IsDatabaseOkRow>([{ database: 2 }]))
      await expect(isDatabaseOk(dummyApp.db)).resolves.toBe(true)
      await expect(isDatabaseOk(dummyApp.db)).resolves.toBe(true)
    })
  })
})
