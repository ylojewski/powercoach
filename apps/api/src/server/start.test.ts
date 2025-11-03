import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../core', async () => {
  const actual = await vi.importActual<typeof import('../core')>('../core')
  return {
    ...actual,
    loadConfig: vi.fn()
  }
})

vi.mock('../app', () => ({
  buildApp: vi.fn()
}))

const modulePath = './start'

interface FakeApp {
  close: ReturnType<typeof vi.fn>
  listen: ReturnType<typeof vi.fn>
  log: { info: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> }
}

function createFakeApp(): FakeApp {
  return {
    close: vi.fn().mockResolvedValue(undefined),
    listen: vi.fn().mockResolvedValue('0.0.0.0:12345'),
    log: {
      error: vi.fn(),
      info: vi.fn()
    }
  }
}

describe('start', () => {
  beforeEach(async () => {
    vi.resetModules()
  })

  it('starts the server with loaded configuration', async () => {
    const { loadConfig } = await import('../core')
    const { buildApp } = await import('../app')
    const fakeApp = createFakeApp()
    ;(loadConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      HOST: '0.0.0.0',
      LOG_LEVEL: 'info',
      NODE_ENV: 'test',
      PORT: 0
    })
    ;(buildApp as ReturnType<typeof vi.fn>).mockResolvedValue(fakeApp)

    const { start } = await import(modulePath)
    const result = await start()

    expect(buildApp).toHaveBeenCalledWith({
      config: { HOST: '0.0.0.0', LOG_LEVEL: 'info', NODE_ENV: 'test', PORT: 0 }
    })
    expect(fakeApp.listen).toHaveBeenCalledWith({ host: '0.0.0.0', port: 0 })
    expect(result.address).toBe('0.0.0.0:12345')
    const [, port] = result.address.split(':')
    expect(Number(port)).toBeGreaterThan(0)
  })

  it('logs and exits when listen fails', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never)
    const { loadConfig } = await import('../core')
    const { buildApp } = await import('../app')
    const fakeApp = createFakeApp()
    fakeApp.listen.mockRejectedValue(new Error('boom'))
    ;(loadConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      HOST: '127.0.0.1',
      LOG_LEVEL: 'info',
      NODE_ENV: 'test',
      PORT: 3000
    })
    ;(buildApp as ReturnType<typeof vi.fn>).mockResolvedValue(fakeApp)

    const { start } = await import(modulePath)
    await start()

    expect(fakeApp.log.error).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  it('closes gracefully on shutdown signals', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never)
    const { loadConfig } = await import('../core')
    const { buildApp } = await import('../app')
    const fakeApp = createFakeApp()
    ;(loadConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      HOST: '0.0.0.0',
      LOG_LEVEL: 'info',
      NODE_ENV: 'test',
      PORT: 0
    })
    ;(buildApp as ReturnType<typeof vi.fn>).mockResolvedValue(fakeApp)

    const { start } = await import(modulePath)
    await start()

    process.emit('SIGINT')
    await vi.waitFor(() => {
      expect(fakeApp.close).toHaveBeenCalledTimes(1)
      expect(exitSpy).toHaveBeenCalledWith(0)
    })

    process.emit('SIGTERM')
    await vi.waitFor(() => {
      expect(fakeApp.close).toHaveBeenCalledTimes(1)
    })
  })

  it('handles unhandled rejections and uncaught exceptions', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never)
    const { loadConfig } = await import('../core')
    const { buildApp } = await import('../app')
    const fakeApp = createFakeApp()
    ;(loadConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      HOST: '0.0.0.0',
      LOG_LEVEL: 'info',
      NODE_ENV: 'test',
      PORT: 0
    })
    ;(buildApp as ReturnType<typeof vi.fn>).mockResolvedValue(fakeApp)

    const { start } = await import(modulePath)
    await start()

    process.emit('unhandledRejection', new Error('reject'))
    await vi.waitFor(() => {
      expect(fakeApp.log.error).toHaveBeenCalled()
      expect(fakeApp.close).toHaveBeenCalled()
      expect(exitSpy).toHaveBeenCalledWith(0)
    })

    fakeApp.log.error.mockClear()
    fakeApp.close.mockClear()
    exitSpy.mockClear()

    process.emit('uncaughtException', new Error('crash'))
    await vi.waitFor(() => {
      expect(fakeApp.log.error).toHaveBeenCalled()
    })
    expect(fakeApp.close).not.toHaveBeenCalled()
    expect(exitSpy).not.toHaveBeenCalled()
  })

  it('logs errors when closing fails', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never)
    const { loadConfig } = await import('../core')
    const { buildApp } = await import('../app')
    const fakeApp = createFakeApp()
    fakeApp.close.mockRejectedValue(new Error('close fail'))
    ;(loadConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      HOST: '0.0.0.0',
      LOG_LEVEL: 'info',
      NODE_ENV: 'test',
      PORT: 0
    })
    ;(buildApp as ReturnType<typeof vi.fn>).mockResolvedValue(fakeApp)

    const { start } = await import(modulePath)
    await start()

    process.emit('SIGINT')
    await vi.waitFor(() => {
      expect(fakeApp.log.error).toHaveBeenCalledWith(
        expect.objectContaining({ err: expect.any(Error) }),
        'Error during Fastify shutdown'
      )
      expect(exitSpy).toHaveBeenCalledWith(0)
    })
  })

  it('auto-starts when executed directly outside test environment', async () => {
    const originalEnv = process.env.NODE_ENV
    const originalArgv = [...process.argv]
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never)
    const { loadConfig } = await import('../core')
    const { buildApp } = await import('../app')
    const fakeApp = createFakeApp()
    fakeApp.listen.mockResolvedValue('0.0.0.0:3000')
    ;(loadConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      HOST: '0.0.0.0',
      LOG_LEVEL: 'info',
      NODE_ENV: 'development',
      PORT: 0
    })
    ;(buildApp as ReturnType<typeof vi.fn>).mockResolvedValue(fakeApp)

    process.env.NODE_ENV = 'development'
    const moduleFilePath = fileURLToPath(new URL('./start.ts', import.meta.url))
    process.argv[1] = moduleFilePath

    await import(modulePath)

    await vi.waitFor(() => {
      expect(buildApp).toHaveBeenCalled()
      expect(fakeApp.listen).toHaveBeenCalled()
    })
    expect(exitSpy).not.toHaveBeenCalled()

    process.env.NODE_ENV = originalEnv
    process.argv.splice(0, process.argv.length, ...originalArgv)
  })

  it('does not auto-start when imported under test environment', async () => {
    const { start } = await import(modulePath)
    expect(typeof start).toBe('function')
  })
})
