const mocks = vi.hoisted(() => ({
  appendFileSync: vi.fn(),
  createRequire: vi.fn(),
  generateEndpoints: vi.fn(),
  mkdirSync: vi.fn(),
  readFileSync: vi.fn(),
  requireResolve: vi.fn(),
  rmSync: vi.fn()
}))

vi.mock('node:fs', () => {
  const fs = {
    appendFileSync: mocks.appendFileSync,
    mkdirSync: mocks.mkdirSync,
    readFileSync: mocks.readFileSync,
    rmSync: mocks.rmSync
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

const RESOLVED_STORE_FILE = '/virtual/apps/manager/src/store/index.ts' as const
const RESOLVED_GENERATED_DIR = '/virtual/apps/manager/src/store/generated' as const
const RESOLVED_OPENAPI_FILE = '/virtual/apps/api/dist/openapi.json' as const

const OPENAPI = JSON.stringify({
  openapi: '3.0.0',
  paths: {
    '/blorbo': {
      get: {
        operationId: 'listBlorbo',
        tags: ['blorbo']
      },
      post: {
        operationId: 'createBlorbo',
        tags: ['blorbo']
      }
    },
    '/blorbo/duplicate': {
      get: {
        operationId: 'listBlorbo',
        tags: ['blorbo']
      }
    },
    '/ignored': {
      delete: {
        operationId: 'deleteBlorbo'
      },
      patch: {
        tags: ['blorbo']
      }
    },
    '/ref': {
      $ref: '#/components/pathItems/ref'
    },
    '/zindle': {
      get: {
        operationId: 'getZindle',
        tags: ['zindle']
      }
    }
  }
})

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
      if (id === '@/src/store') {
        return RESOLVED_STORE_FILE
      }

      if (id === '@powercoach/api/openapi.json') {
        return RESOLVED_OPENAPI_FILE
      }

      throw new Error(`Unexpected resolve: ${id}`)
    })
    mocks.readFileSync.mockReturnValue(OPENAPI)
    mocks.generateEndpoints.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('generates endpoint files from openapi tags', async () => {
    await import('./generate')

    expect(mocks.readFileSync).toHaveBeenCalledExactlyOnceWith(RESOLVED_OPENAPI_FILE, 'utf8')
    expect(mocks.rmSync).toHaveBeenCalledExactlyOnceWith(RESOLVED_GENERATED_DIR, {
      force: true,
      recursive: true
    })
    expect(mocks.mkdirSync).toHaveBeenCalledExactlyOnceWith(RESOLVED_GENERATED_DIR)

    expect(mocks.generateEndpoints).toHaveBeenCalledTimes(2)
    expect(mocks.generateEndpoints).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        apiFile: '@/src/store/manager.ts',
        apiImport: 'managerApi',
        exportName: 'blorboApi',
        filterEndpoints: ['listBlorbo', 'createBlorbo'],
        hooks: GENERATE_ENDPOINTS_HOOKS,
        outputFile: `${RESOLVED_GENERATED_DIR}/blorbo.generated.ts`,
        schemaFile: RESOLVED_OPENAPI_FILE
      })
    )
    expect(mocks.generateEndpoints).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        apiFile: '@/src/store/manager.ts',
        apiImport: 'managerApi',
        exportName: 'zindleApi',
        filterEndpoints: ['getZindle'],
        hooks: GENERATE_ENDPOINTS_HOOKS,
        outputFile: `${RESOLVED_GENERATED_DIR}/zindle.generated.ts`,
        schemaFile: RESOLVED_OPENAPI_FILE
      })
    )

    expect(console.info).toHaveBeenNthCalledWith(1, '✅ src/store/generated/blorbo.generated.ts')
    expect(console.info).toHaveBeenNthCalledWith(2, '✅ src/store/generated/zindle.generated.ts')

    expect(mocks.appendFileSync).toHaveBeenNthCalledWith(
      1,
      `${RESOLVED_GENERATED_DIR}/index.ts`,
      "export * from './blorbo.generated'\n",
      'utf-8'
    )
    expect(mocks.appendFileSync).toHaveBeenNthCalledWith(
      2,
      `${RESOLVED_GENERATED_DIR}/index.ts`,
      "export * from './zindle.generated'\n",
      'utf-8'
    )
  })

  it('does not log generated files when --quiet is passed', async () => {
    vi.spyOn(process, 'argv', 'get').mockReturnValue(['node', 'generate', '--quiet'])
    await import('./generate')
    expect(console.info).not.toHaveBeenCalled()
  })
})
