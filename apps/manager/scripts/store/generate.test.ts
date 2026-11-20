const mocks = vi.hoisted(() => ({
  createRequire: vi.fn(),
  existsSync: vi.fn(),
  generateEndpoints: vi.fn(),
  mkdirSync: vi.fn(),
  readFileSync: vi.fn(),
  requireResolve: vi.fn(),
  rmSync: vi.fn(),
  writeFileSync: vi.fn()
}))

vi.mock('node:fs', () => {
  const fs = {
    existsSync: mocks.existsSync,
    mkdirSync: mocks.mkdirSync,
    readFileSync: mocks.readFileSync,
    rmSync: mocks.rmSync,
    writeFileSync: mocks.writeFileSync
  }

  return { ...fs, default: fs }
})

vi.mock('node:module', () => {
  const module = { createRequire: mocks.createRequire }
  return { ...module, default: module }
})

vi.mock('@rtk-query/codegen-openapi', () => ({
  generateEndpoints: mocks.generateEndpoints
}))

const RESOLVED_API_FILE = '/virtual/apps/manager/src/core/api/index.ts' as const
const RESOLVED_GENERATED_DIR = '/virtual/apps/manager/src/core/api/generated' as const
const RESOLVED_HOOKS_FILE = '/virtual/apps/manager/src/core/hooks/index.ts' as const
const RESOLVED_PENDING_QUERIES_FILE =
  '/virtual/apps/manager/src/core/hooks/usePendingQuery.generated.ts' as const
const RESOLVED_OPENAPI_FILE = '/virtual/apps/api/dist/openapi.json' as const

const GENERATED_PENDING_QUERIES =
  "import { usePendingQuery } from './usePendingQuery'\nimport { useGetExerciseCodeQuery, useGetReferencesQuery } from '../api'\n\nexport const usePendingGetExerciseCodeQuery = usePendingQuery(useGetExerciseCodeQuery)\nexport const usePendingGetReferencesQuery = usePendingQuery(useGetReferencesQuery)"

describe('generate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    vi.spyOn(console, 'info').mockImplementation(() => {
      /* NOOP */
    })

    mocks.createRequire.mockReturnValue({ resolve: mocks.requireResolve })
    mocks.requireResolve.mockImplementation((id: string) => {
      if (id === '@/core/api') return RESOLVED_API_FILE
      if (id === '@/core/hooks') return RESOLVED_HOOKS_FILE
      if (id === '@powercoach/api/openapi.json') return RESOLVED_OPENAPI_FILE
      throw new Error(`Unexpected resolve: ${id}`)
    })
    mocks.existsSync.mockReturnValue(true)
    mocks.generateEndpoints.mockResolvedValue(undefined)
    mocks.readFileSync.mockReturnValue(
      'export const { useGetExerciseCodeQuery, useLazyGetExerciseCodeQuery, useGetReferencesQuery } = injectedRtkApi\n'
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('generates API endpoints and their pending query hooks', async () => {
    await import('./generate')

    expect(mocks.existsSync).toHaveBeenCalledExactlyOnceWith(RESOLVED_OPENAPI_FILE)
    expect(mocks.rmSync.mock.calls).toStrictEqual([
      [RESOLVED_GENERATED_DIR, { force: true, recursive: true }],
      [RESOLVED_PENDING_QUERIES_FILE, { force: true, recursive: true }]
    ])
    expect(mocks.mkdirSync).toHaveBeenCalledExactlyOnceWith(RESOLVED_GENERATED_DIR)
    expect(mocks.generateEndpoints).toHaveBeenCalledExactlyOnceWith({
      apiFile: './src/core/api/apiSlice.ts',
      apiImport: 'apiSlice',
      exportName: 'api',
      hooks: {
        lazyQueries: true,
        mutations: true,
        queries: true
      },
      outputFile: `${RESOLVED_GENERATED_DIR}/index.generated.ts`,
      schemaFile: RESOLVED_OPENAPI_FILE
    })
    expect(mocks.writeFileSync.mock.calls).toStrictEqual([
      [RESOLVED_PENDING_QUERIES_FILE, GENERATED_PENDING_QUERIES, 'utf-8'],
      [`${RESOLVED_GENERATED_DIR}/index.ts`, "export * from './index.generated'", 'utf-8']
    ])
    expect(console.info).toHaveBeenNthCalledWith(1, '✅ src/core/api/generated/index.generated.ts')
    expect(console.info).toHaveBeenNthCalledWith(
      2,
      '✅ src/core/hooks/usePendingQuery.generated.ts'
    )
  })

  it('generates a never type when the API has no query hooks', async () => {
    mocks.readFileSync.mockReturnValue(undefined)

    await import('./generate')

    expect(mocks.writeFileSync).toHaveBeenNthCalledWith(
      1,
      RESOLVED_PENDING_QUERIES_FILE,
      'export type GeneratedQueryHook = never\n',
      'utf-8'
    )
  })

  it('does not log generated files in quiet mode', async () => {
    vi.spyOn(process, 'argv', 'get').mockReturnValue(['node', 'generate', '--quiet'])

    await import('./generate')

    expect(console.info).not.toHaveBeenCalled()
  })

  it('reports an unresolved OpenAPI contract', async () => {
    mocks.requireResolve.mockImplementation((id: string) => {
      if (id === '@/core/api') return RESOLVED_API_FILE
      if (id === '@/core/hooks') return RESOLVED_HOOKS_FILE
      throw new Error(`Unexpected resolve: ${id}`)
    })

    await expect(import('./generate')).rejects.toThrow(/Missing @powercoach\/api\/openapi.json/)
    expect(mocks.existsSync).not.toHaveBeenCalled()
  })

  it('reports a missing OpenAPI contract', async () => {
    mocks.existsSync.mockReturnValue(false)

    await expect(import('./generate')).rejects.toThrow(/Missing @powercoach\/api\/openapi.json/)
    expect(mocks.generateEndpoints).not.toHaveBeenCalled()
  })
})
