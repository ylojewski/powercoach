const mocks = vi.hoisted(() => ({
  createRequire: vi.fn(),
  existsSync: vi.fn(),
  generateEndpoints: vi.fn(),
  mkdirSync: vi.fn(),
  requireResolve: vi.fn(),
  rmSync: vi.fn(),
  writeFileSync: vi.fn()
}))

vi.mock('node:fs', () => {
  const fs = {
    existsSync: mocks.existsSync,
    mkdirSync: mocks.mkdirSync,
    rmSync: mocks.rmSync,
    writeFileSync: mocks.writeFileSync
  }

  return {
    ...fs,
    default: fs
  }
})

vi.mock('node:module', () => {
  const module = {
    createRequire: mocks.createRequire
  }

  return {
    ...module,
    default: module
  }
})

vi.mock('@rtk-query/codegen-openapi', () => ({
  generateEndpoints: mocks.generateEndpoints
}))

const RESOLVED_API_FILE = '/virtual/apps/manager/src/core/api/index.ts' as const
const RESOLVED_GENERATED_DIR = '/virtual/apps/manager/src/core/api/generated' as const
const RESOLVED_OPENAPI_FILE = '/virtual/apps/api/dist/openapi.json' as const

const GENERATE_ENDPOINTS_HOOKS = {
  lazyQueries: true,
  mutations: true,
  queries: true
} as const

describe('generate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    vi.unstubAllEnvs()
    vi.spyOn(console, 'info').mockImplementation(() => {
      /* NOOP */
    })

    mocks.createRequire.mockReturnValue({ resolve: mocks.requireResolve })
    mocks.requireResolve.mockImplementation((id: string) => {
      if (id === '@/core/api') {
        return RESOLVED_API_FILE
      }

      if (id === '@powercoach/api/openapi.json') {
        return RESOLVED_OPENAPI_FILE
      }

      throw new Error(`Unexpected resolve: ${id}`)
    })
    mocks.existsSync.mockReturnValue(true)
    mocks.generateEndpoints.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('generates a single endpoint file for all tags', async () => {
    await import('./generate')

    expect(mocks.existsSync).toHaveBeenCalledExactlyOnceWith(RESOLVED_OPENAPI_FILE)
    expect(mocks.rmSync).toHaveBeenCalledExactlyOnceWith(RESOLVED_GENERATED_DIR, {
      force: true,
      recursive: true
    })
    expect(mocks.mkdirSync).toHaveBeenCalledExactlyOnceWith(RESOLVED_GENERATED_DIR)

    expect(mocks.generateEndpoints).toHaveBeenCalledExactlyOnceWith({
      apiFile: './src/core/api/apiSlice.ts',
      apiImport: 'apiSlice',
      exportName: 'api',
      hooks: GENERATE_ENDPOINTS_HOOKS,
      outputFile: `${RESOLVED_GENERATED_DIR}/index.generated.ts`,
      schemaFile: RESOLVED_OPENAPI_FILE
    })

    expect(mocks.writeFileSync).toHaveBeenCalledExactlyOnceWith(
      `${RESOLVED_GENERATED_DIR}/index.ts`,
      "export * from './index.generated'\n",
      'utf-8'
    )

    expect(console.info).toHaveBeenCalledExactlyOnceWith(
      '✅ src/core/api/generated/index.generated.ts'
    )
  })

  it('does not log generated files when --quiet is passed', async () => {
    vi.spyOn(process, 'argv', 'get').mockReturnValue(['node', 'generate', '--quiet'])
    await import('./generate')
    expect(console.info).not.toHaveBeenCalled()
  })

  it('fails to resolve the openapi file', async () => {
    mocks.requireResolve.mockClear().mockImplementation((id: string) => {
      if (id === '@/core/api') {
        return RESOLVED_API_FILE
      }
      throw new Error(`Unexpected resolve: ${id}`)
    })

    await expect(import('./generate')).rejects.toThrow(
      `Missing @powercoach/api/openapi.json. Run "pnpm --filter @powercoach/api openapi:generate" before generating the manager store.`
    )

    expect(mocks.existsSync).not.toHaveBeenCalled()
    expect(mocks.generateEndpoints).not.toHaveBeenCalled()
  })

  it('throws an explicit error when the openapi file is missing', async () => {
    mocks.existsSync.mockReturnValue(false)

    await expect(import('./generate')).rejects.toThrow(
      `Missing @powercoach/api/openapi.json. Run "pnpm --filter @powercoach/api openapi:generate" before generating the manager store.`
    )

    expect(mocks.generateEndpoints).not.toHaveBeenCalled()
  })
})
