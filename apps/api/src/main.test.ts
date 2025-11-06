import { start } from '@/src/server'

vi.mock('@/src/server', () => ({
  start: vi.fn()
}))

describe('main', () => {
  it('should starts the server', async () => {
    await import('./main')
    expect(start).toHaveBeenCalledExactlyOnceWith()
  })
})
