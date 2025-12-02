import { rmSync, mkdirSync, existsSync, readFileSync } from 'node:fs'

const OUTPUT_DIR = 'dist' as const
const OUTPUT_FILE = 'dist/vercel.json' as const

describe('generateVercel', () => {
  beforeAll(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {
      /* NOOP */
    })
    rmSync(OUTPUT_DIR, { force: true, recursive: true })
    mkdirSync(OUTPUT_DIR)
  })

  afterEach(() => {
    rmSync(OUTPUT_FILE, { force: true })
    vi.clearAllMocks()
    vi.resetModules()
  })

  afterAll(() => {
    rmSync(OUTPUT_DIR, { force: true, recursive: true })
    vi.restoreAllMocks()
  })

  it('generates a vercel.json file', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
    await import('./vercelPrepare')
    expect(existsSync(OUTPUT_FILE)).toBe(true)
    expect(console.info).toHaveBeenCalledExactlyOnceWith('✅ dist/vercel.json')
    expect(JSON.parse(readFileSync(OUTPUT_FILE, 'utf-8'))).toMatchObject(
      expect.objectContaining({
        rewrites: expect.arrayContaining([
          { destination: 'http://localhost:8080/:path*', source: '/api/:path*' }
        ])
      })
    )
  })

  it('throws on missing env var', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    await expect(import('./vercelPrepare')).rejects.toThrow(
      /process.env.VITE_API_BASE_URL is not defined/i
    )
    expect(existsSync(OUTPUT_FILE)).toBe(false)
  })

  it('does not logs when --quiet', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')
    vi.spyOn(process, 'argv', 'get').mockReturnValue(['--quiet'])
    await import('./vercelPrepare')
    expect(console.info).not.toHaveBeenCalled()
  })
})
