import { spyOnConsole } from '@powercoach/util-test/src'

const sqlMock = vi.fn()
const executeMock = vi.fn()
const endMock = vi.fn()

vi.mock('drizzle-orm', () => ({
  sql: sqlMock
}))

vi.mock('@/src/client', () => ({
  createClient: vi.fn().mockImplementation(() => ({
    db: { execute: executeMock },
    pg: { end: endMock }
  }))
}))

spyOnConsole(['error', 'log'])

describe('reset.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('executes reset query and close connection on success', async () => {
    executeMock.mockResolvedValueOnce(undefined)
    await import('./drop')
    expect(sqlMock).toHaveBeenCalledExactlyOnceWith([
      expect.stringMatching(/(?=.*DROP SCHEMA)(?=.*FROM pg_namespace)(?=.*CREATE SCHEMA public)/s)
    ])
    expect(endMock).toHaveBeenCalledOnce()
    expect(console.log).toHaveBeenCalledOnce()
  })

  it('rethrows on failure', async () => {
    executeMock.mockRejectedValueOnce(new Error('execute'))
    await expect(import('./drop')).rejects.toThrow(/execute/)
    expect(endMock).toHaveBeenCalledOnce()
    expect(console.error).toHaveBeenCalledOnce()
  })
})
