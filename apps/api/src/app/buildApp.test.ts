interface InjectOptions {
  headers?: Record<string, string>
  url: string
}

interface InjectResponse {
  headers: Record<string, string>
  json: () => unknown
  statusCode: number
}

interface FastifyRequest {
  headers: Record<string, string>
  id: string
}

type HookHandler = (
  request: FastifyRequest,
  reply: { header(name: string, value: string): void }
) => void | Promise<void>
type RouteHandler = (request: FastifyRequest) => unknown

interface FastifyStub {
  addHook: (name: string, hook: HookHandler) => FastifyStub
  close: () => Promise<void>
  decorate: (name: string, value: unknown) => FastifyStub
  get: (url: string, handler: RouteHandler) => FastifyStub
  hooks: Map<string, HookHandler[]>
  inject: (options: InjectOptions) => Promise<InjectResponse>
  log: { error: ReturnType<typeof vi.fn>; info: ReturnType<typeof vi.fn> }
  options: { genReqId: (request: { headers: Record<string, string | undefined> }) => string }
  ready: () => Promise<FastifyStub>
  register: (
    plugin: (app: FastifyStub, opts?: unknown) => unknown,
    opts?: unknown
  ) => Promise<FastifyStub>
  routes: Map<string, RouteHandler>
  withTypeProvider: () => FastifyStub
  [key: string]: unknown
}

const helmetPluginMock = vi.fn(async (app: FastifyStub) => {
  app.decorate('helmetRegistered', true)
})

const sensiblePluginMock = vi.fn(async (app: FastifyStub) => {
  app.decorate('sensibleRegistered', true)
})

const healthModuleMock = vi.fn(async (app: FastifyStub, options?: { prefix?: string }) => {
  const url = options?.prefix ?? '/'
  app.get(url, async () => ({ prefix: options?.prefix }))
})

const fastifyInstances: FastifyStub[] = []

function createFastifyStub(options: FastifyStub['options']): FastifyStub {
  const hooks = new Map<string, HookHandler[]>()
  const routes = new Map<string, RouteHandler>()

  const instance: FastifyStub = {
    addHook: vi.fn((name: string, hook: HookHandler) => {
      const existing = hooks.get(name) ?? []
      existing.push(hook)
      hooks.set(name, existing)
      return instance
    }),
    close: vi.fn(async () => undefined),
    decorate: vi.fn((name: string, value: unknown) => {
      instance[name] = value
      return instance
    }),
    get: vi.fn((url: string, handler: RouteHandler) => {
      routes.set(url, handler)
      return instance
    }),
    hooks,
    inject: vi.fn(async ({ headers = {}, url }: InjectOptions) => {
      const request: FastifyRequest = {
        headers,
        id: options.genReqId({ headers })
      }
      const replyHeaders = new Map<string, string>()
      const reply = {
        header: (name: string, value: string) => replyHeaders.set(name.toLowerCase(), value)
      }

      for (const hook of hooks.get('onRequest') ?? []) {
        await hook(request, reply)
      }

      const handler = routes.get(url)
      const payload = handler ? await handler(request) : undefined

      return {
        headers: Object.fromEntries(replyHeaders),
        json: () => payload,
        statusCode: payload ? 200 : 404
      }
    }),
    log: { error: vi.fn(), info: vi.fn() },
    options,
    ready: vi.fn(async () => instance),
    register: vi.fn(
      async (plugin: (app: FastifyStub, opts?: unknown) => unknown, opts?: unknown) => {
        await plugin(instance, opts ?? {})
        return instance
      }
    ),
    routes,
    withTypeProvider: vi.fn(() => instance)
  }

  return instance
}

function mockFastify() {
  vi.doMock('fastify', () => ({
    default: (options: FastifyStub['options']) => {
      const instance = createFastifyStub(options)
      fastifyInstances.push(instance)
      return instance
    }
  }))
}

function mockDependencies() {
  vi.doMock('../plugins', () => ({
    helmetPlugin: helmetPluginMock,
    sensiblePlugin: sensiblePluginMock
  }))

  vi.doMock('../modules', () => ({
    healthModule: healthModuleMock
  }))
}

describe('buildApp', () => {
  beforeEach(() => {
    vi.resetModules()
    fastifyInstances.length = 0
    helmetPluginMock.mockClear()
    sensiblePluginMock.mockClear()
    healthModuleMock.mockClear()
  })

  afterEach(() => {
    vi.doUnmock('fastify')
    vi.doUnmock('../plugins')
    vi.doUnmock('../modules')
    vi.doUnmock('../core')
  })

  it('builds an app using the provided configuration', async () => {
    mockFastify()
    mockDependencies()

    const { buildApp } = await import('./buildApp')
    const config = {
      HOST: '127.0.0.1',
      LOG_LEVEL: 'info',
      NODE_ENV: 'development',
      PORT: 4000
    }

    const app = await buildApp({ config })
    const [instance] = fastifyInstances

    expect(instance.options).toMatchObject({
      ajv: {
        customOptions: {
          coerceTypes: false,
          removeAdditional: 'all'
        }
      },
      disableRequestLogging: true,
      requestIdHeader: 'x-request-id',
      requestIdLogLabel: 'reqId'
    })

    expect(instance.options.genReqId({ headers: { 'x-request-id': 'custom-id' } })).toBe(
      'custom-id'
    )
    expect(instance.options.genReqId({ headers: {} })).toMatch(/[0-9a-f-]{36}/)

    expect(instance.decorate).toHaveBeenCalledWith('config', config)
    expect(helmetPluginMock).toHaveBeenCalledWith(app, expect.any(Object))
    expect(sensiblePluginMock).toHaveBeenCalledWith(app, expect.any(Object))
    expect(healthModuleMock).toHaveBeenCalledWith(app, { prefix: '/v1/health' })
    expect(instance.get).toHaveBeenCalledWith('/v1/health', expect.any(Function))

    const [onRequestHook] = instance.hooks.get('onRequest') ?? []
    const headers = new Map<string, string>()
    await onRequestHook?.(
      { id: 'request-id' },
      { header: (name: string, value: string) => headers.set(name, value) }
    )
    expect(headers.get('x-request-id')).toBe('request-id')

    await app.close()
  })

  it('loads configuration when none is provided', async () => {
    mockFastify()
    mockDependencies()

    const config = {
      HOST: '0.0.0.0',
      LOG_LEVEL: 'debug',
      NODE_ENV: 'test',
      PORT: 3001
    }

    const loadConfigMock = vi.fn(() => config)
    vi.doMock('../core', async () => {
      const actual = await vi.importActual<typeof import('../core')>('../core')
      return {
        ...actual,
        loadConfig: loadConfigMock
      }
    })

    const { buildApp } = await import('./buildApp')

    const app = await buildApp()

    expect(loadConfigMock).toHaveBeenCalledTimes(1)

    const [instance] = fastifyInstances
    expect(instance.decorate).toHaveBeenCalledWith('config', config)

    await app.close()
  })

  it('serves the health endpoint with a real Fastify instance', async () => {
    const { buildApp } = await import('./buildApp')

    const app = await buildApp({
      config: {
        HOST: '127.0.0.1',
        LOG_LEVEL: 'fatal',
        NODE_ENV: 'test',
        PORT: 0
      }
    })

    const response = await app.inject({ method: 'GET', url: '/v1/health' })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({ ok: true, uptime: expect.any(Number) })

    await app.close()
  })
})
