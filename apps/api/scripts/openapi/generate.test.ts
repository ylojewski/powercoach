import { existsSync, mkdirSync } from 'node:fs'

const OUTPUT_DIR = 'dist' as const
const OUTPUT_FILE = 'dist/openapi.json' as const

describe('generate', () => {
  beforeAll(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {
      /* NOOP */
    })
    mkdirSync(OUTPUT_DIR, { recursive: true })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.doUnmock('@/src/app')
    vi.doUnmock('@/src/plugins')
    vi.resetModules()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('generates an openapi.json file', async () => {
    await import('./generate')
    expect(existsSync(OUTPUT_FILE)).toBe(true)
    expect(console.info).toHaveBeenCalledExactlyOnceWith('✅ dist/openapi.json')
  })

  it('wires the OpenAPI build through the shared core helpers and swagger plugin', async () => {
    const steps: string[] = []
    const fakeApp = {
      close: vi.fn().mockResolvedValue(undefined),
      ready: vi.fn().mockResolvedValue(undefined),
      register: vi.fn().mockImplementation(async () => {
        steps.push('app.register')
      }),
      swagger: vi.fn().mockReturnValue({ openapi: '3.1.0' })
    }
    const createBaseAppMock = vi.fn().mockReturnValue(fakeApp)
    const registerCorePluginsMock = vi.fn().mockImplementation(async () => {
      steps.push('registerCorePlugins')
    })
    const registerCoreModulesMock = vi.fn().mockImplementation(async () => {
      steps.push('registerCoreModules')
    })
    const swaggerPluginMock = { name: 'swagger.plugin.mock' }

    vi.doMock('@/src/app', () => ({
      createBaseApp: createBaseAppMock,
      registerCoreModules: registerCoreModulesMock,
      registerCorePlugins: registerCorePluginsMock
    }))
    vi.doMock('@/src/plugins', () => ({
      swaggerPlugin: swaggerPluginMock
    }))

    const { ENV, buildOpenAPIApp } = await import('./generate')

    vi.clearAllMocks()
    steps.length = 0

    await expect(buildOpenAPIApp(ENV)).resolves.toBe(fakeApp)

    expect(createBaseAppMock).toHaveBeenCalledExactlyOnceWith(ENV)
    expect(registerCorePluginsMock).toHaveBeenCalledExactlyOnceWith(fakeApp)
    expect(fakeApp.register).toHaveBeenCalledExactlyOnceWith(swaggerPluginMock)
    expect(registerCoreModulesMock).toHaveBeenCalledExactlyOnceWith(fakeApp)
    expect(steps).toStrictEqual(['registerCorePlugins', 'app.register', 'registerCoreModules'])
  })

  it('does not logs when --quiet', async () => {
    vi.spyOn(process, 'argv', 'get').mockReturnValue(['node', 'generate', '--quiet'])
    await import('./generate')
    expect(existsSync(OUTPUT_FILE)).toBe(true)
    expect(console.info).not.toHaveBeenCalled()
  })
})
