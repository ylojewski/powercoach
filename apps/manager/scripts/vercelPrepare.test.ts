import { rmSync, mkdirSync, existsSync, readFileSync } from 'node:fs'

const OUTPUT_DIR = 'dist' as const
const OUTPUT_FILE = 'dist/vercel.json' as const

describe('generateVercel', () => {
  beforeAll(() => {
    vi.spyOn(process, 'argv', 'get').mockReturnValue(['--quiet'])
    rmSync(OUTPUT_DIR, { force: true, recursive: true })
    mkdirSync(OUTPUT_DIR)
  })

  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    rmSync(OUTPUT_FILE, { force: true })
    vi.resetModules()
  })

  afterAll(() => {
    rmSync(OUTPUT_DIR, { force: true, recursive: true })
    vi.restoreAllMocks()
  })

  it('should generate a vercel.json file', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080')

    await import('./vercelPrepare')

    expect(existsSync(OUTPUT_FILE)).toBe(true)
    expect(JSON.parse(readFileSync(OUTPUT_FILE, 'utf-8'))).toMatchObject(
      expect.objectContaining({
        rewrites: expect.arrayContaining([
          { destination: 'http://localhost:8080/:path*', source: '/api/:path*' }
        ])
      })
    )
  })

  it('uses default values when env vars are missing', async () => {
    await import('./vercelPrepare')

    expect(existsSync(OUTPUT_FILE)).toBe(true)
    expect(JSON.parse(readFileSync(OUTPUT_FILE, 'utf-8'))).toMatchObject(
      expect.objectContaining({
        rewrites: expect.arrayContaining([
          { destination: 'http://localhost:8080/:path*', source: '/api/:path*' }
        ])
      })
    )
  })

  it('should throw on missing env var', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')

    await expect(import('./vercelPrepare')).rejects.toThrow(
      /process.env.VITE_API_BASE_URL is not defined/i
    )
    expect(existsSync(OUTPUT_FILE)).toBe(false)
  })
})
