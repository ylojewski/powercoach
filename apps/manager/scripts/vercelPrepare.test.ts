import { writeFileSync } from 'node:fs'

import { expect, MockedFunction } from 'vitest'

import { vercelPrepare } from './vercelPrepare'

describe('generateVercel', () => {
  vi.mock('node:fs', async (importFs) => {
    return { ...(await importFs()), writeFileSync: vi.fn() }
  })

  const writeFileSyncMock = writeFileSync as MockedFunction<typeof writeFileSync>

  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
    vi.unstubAllEnvs()
  })

  it('should generate a vercel.json file', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
    vercelPrepare()
    const [[file, content] = ['', '{}']] = writeFileSyncMock.mock.calls
    expect(writeFileSyncMock).toHaveBeenCalledOnce()
    expect(file).toBe('vercel.json')
    expect(JSON.parse(content as string)).toMatchObject(
      expect.objectContaining({
        rewrites: expect.arrayContaining([
          { destination: 'http://localhost:8080/:path*', source: '/api/:path*' }
        ])
      })
    )
  })

  it('should throw on missing env var', () => {
    // TODO
  })
})
