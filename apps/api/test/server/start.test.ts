import process from 'node:process'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const buildAppMock = vi.fn()
const loadConfigMock = vi.fn()

vi.mock('../../src/app', () => ({
  buildApp: buildAppMock
}))

vi.mock('../../src/core', () => ({
  loadConfig: loadConfigMock
}))

describe('start', () => {
  beforeEach(() => {
    vi.resetModules()
    buildAppMock.mockReset()
    loadConfigMock.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts the server and wires shutdown handlers', async () => {
    const config = {
      HOST: '0.0.0.0',
      PORT: 3000
    }

    loadConfigMock.mockReturnValue(config)

    const handlers = new Map<string, (payload: unknown) => void>()
    const processOnSpy = vi.spyOn(process, 'on').mockImplementation((event, handler) => {
      handlers.set(event, handler as (payload: unknown) => void)
      return process
    })
    const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

    const app = {
      close: vi.fn().mockResolvedValue(undefined),
      listen: vi.fn().mockResolvedValue('http://localhost:3000'),
      log: {
        error: vi.fn(),
        info: vi.fn()
      }
    }

    buildAppMock.mockResolvedValue(app)

    const { start } = await import('../../src/server/start')

    const result = await start()

    expect(loadConfigMock).toHaveBeenCalledTimes(1)
    expect(buildAppMock).toHaveBeenCalledWith({ config })
    expect(app.listen).toHaveBeenCalledWith({ host: '0.0.0.0', port: 3000 })
    expect(app.log.info).toHaveBeenCalledWith(
      { address: 'http://localhost:3000' },
      'Server listening'
    )
    expect(result).toEqual({ address: 'http://localhost:3000', app })

    const sigintHandler = handlers.get('SIGINT')
    if (!sigintHandler) {
      throw new Error('SIGINT handler not registered')
    }
    sigintHandler('SIGINT')
    await delay(0)

    expect(app.log.info).toHaveBeenCalledWith({ signal: 'SIGINT' }, 'Received shutdown signal')
    expect(app.close).toHaveBeenCalledTimes(1)
    expect(app.log.info).toHaveBeenCalledWith('Fastify instance closed gracefully')
    expect(processExitSpy).toHaveBeenCalledWith(0)

    const sigtermHandler = handlers.get('SIGTERM')
    if (!sigtermHandler) {
      throw new Error('SIGTERM handler not registered')
    }
    app.close.mockRejectedValueOnce(new Error('close failed'))
    sigtermHandler('SIGTERM')
    await delay(0)

    expect(app.log.error).toHaveBeenCalledWith(
      { err: expect.any(Error) },
      'Error during Fastify shutdown'
    )
    expect(processExitSpy).toHaveBeenCalledWith(0)

    const rejectionHandler = handlers.get('unhandledRejection')
    if (!rejectionHandler) {
      throw new Error('Unhandled rejection handler not registered')
    }
    rejectionHandler('boom')
    await delay(0)
    expect(app.log.error).toHaveBeenCalledWith({ reason: 'boom' }, 'Unhandled rejection')

    const exceptionHandler = handlers.get('uncaughtException')
    if (!exceptionHandler) {
      throw new Error('Uncaught exception handler not registered')
    }
    exceptionHandler(new Error('crash'))
    await delay(0)
    expect(app.log.error).toHaveBeenCalledWith({ err: expect.any(Error) }, 'Uncaught exception')

    processOnSpy.mockRestore()
    processExitSpy.mockRestore()
  })

  it('exits when the server fails to listen', async () => {
    loadConfigMock.mockReturnValue({ HOST: '0.0.0.0', PORT: 3000 })

    const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

    const app = {
      close: vi.fn(),
      listen: vi.fn().mockRejectedValue(new Error('listen failed')),
      log: {
        error: vi.fn(),
        info: vi.fn()
      }
    }

    buildAppMock.mockResolvedValue(app)

    const { start } = await import('../../src/server/start')

    await start()

    expect(app.log.error).toHaveBeenCalledWith({ err: expect.any(Error) }, 'Unable to start server')
    expect(processExitSpy).toHaveBeenCalledWith(1)

    processExitSpy.mockRestore()
  })

  it('auto starts when executed directly outside the test environment', async () => {
    loadConfigMock.mockReturnValue({ HOST: '0.0.0.0', PORT: 3000 })

    const originalNodeEnv = process.env.NODE_ENV
    const originalArgv = process.argv.slice()
    const scriptPath = fileURLToPath(new URL('../../src/server/start.ts', import.meta.url))

    process.env.NODE_ENV = 'development'
    process.argv = [process.argv[0], scriptPath]

    const processOnSpy = vi.spyOn(process, 'on').mockImplementation(() => process)
    const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

    const app = {
      close: vi.fn().mockResolvedValue(undefined),
      listen: vi.fn().mockResolvedValue('http://localhost:3000'),
      log: {
        error: vi.fn(),
        info: vi.fn()
      }
    }

    buildAppMock.mockResolvedValue(app)

    await import('../../src/server/start')

    await delay(0)

    expect(loadConfigMock).toHaveBeenCalledTimes(1)
    expect(app.listen).toHaveBeenCalledWith({ host: '0.0.0.0', port: 3000 })
    expect(app.log.info).toHaveBeenCalledWith(
      { address: 'http://localhost:3000' },
      'Server listening'
    )

    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV
    } else {
      process.env.NODE_ENV = originalNodeEnv
    }
    process.argv = originalArgv

    processOnSpy.mockRestore()
    processExitSpy.mockRestore()
  })
})
