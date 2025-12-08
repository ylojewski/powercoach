import process from 'node:process'

import { expectFunction, flushAsync } from '@powercoach/util-test'
import { type MockedFunction } from 'vitest'

import { type AppFastifyInstance, buildApp } from '@/src/app'
import { loadEnv } from '@/src/core'
import { testEnv } from '@/test/fixtures'

import { start } from './start'

vi.mock('@/src/app', () => ({
  buildApp: vi.fn()
}))

vi.mock('@/src/core', () => ({
  loadEnv: vi.fn()
}))

const buildAppMock = buildApp as MockedFunction<typeof buildApp>
const loadEnvMock = loadEnv as MockedFunction<typeof loadEnv>

describe('start', () => {
  beforeEach(() => {
    buildAppMock.mockReset()
    loadEnvMock.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts the server and wires shutdown handlers', async () => {
    loadEnvMock.mockReturnValue(testEnv)
    const address = `http://${testEnv.HOST}:${testEnv.PORT}`

    const handlers = new Map<string | symbol, (signal: string) => void>()
    const processOnSpy = vi.spyOn(process, 'on').mockImplementation((event, handler) => {
      handlers.set(event, handler)
      return process
    })
    const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

    const app = {
      close: vi.fn().mockResolvedValue(undefined),
      listen: vi.fn().mockResolvedValue(address),
      log: {
        error: vi.fn(),
        info: vi.fn()
      }
    }

    buildAppMock.mockResolvedValue(app as unknown as AppFastifyInstance)

    await start()

    expect(loadEnvMock).toHaveBeenCalledTimes(1)
    expect(buildAppMock).toHaveBeenCalledWith({ env: testEnv })
    expect(app.listen).toHaveBeenCalledWith({ host: testEnv.HOST, port: testEnv.PORT })
    expect(app.log.info).toHaveBeenCalledWith({ address }, 'Server listening')

    const sigintHandler = handlers.get('SIGINT')
    expectFunction(sigintHandler)
    sigintHandler('SIGINT')
    await flushAsync()
    expect(processExitSpy).toHaveBeenCalledWith(0)
    expect(app.log.info).toHaveBeenCalledWith({ signal: 'SIGINT' }, 'Received shutdown signal')
    expect(app.log.info).toHaveBeenCalledWith('Server closed gracefully')
    expect(app.close).toHaveBeenCalledTimes(1)

    app.close.mockRejectedValueOnce(new Error())
    const sigtermHandler = handlers.get('SIGTERM')
    expectFunction(sigtermHandler)
    sigtermHandler('SIGTERM')
    await flushAsync()
    expect(processExitSpy).toHaveBeenCalledWith(0)
    expect(app.log.error).toHaveBeenCalledWith({ err: expect.any(Error) }, 'Error during shutdown')

    const rejectionHandler = handlers.get('unhandledRejection')
    expectFunction(rejectionHandler)
    rejectionHandler('boom')
    await flushAsync()
    expect(app.log.error).toHaveBeenCalledWith({ reason: 'boom' }, 'Unhandled rejection')

    const exceptionHandler = handlers.get('uncaughtException')
    expectFunction(exceptionHandler)
    exceptionHandler(new Error())
    await flushAsync()
    expect(app.log.error).toHaveBeenCalledWith({ err: expect.any(Error) }, 'Uncaught exception')

    processOnSpy.mockRestore()
    processExitSpy.mockRestore()
  })

  it('exits when the server fails to listen', async () => {
    loadEnvMock.mockReturnValue(testEnv)

    const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

    const app = {
      close: vi.fn(),
      listen: vi.fn().mockRejectedValue(new Error()),
      log: {
        error: vi.fn(),
        info: vi.fn()
      }
    }

    buildAppMock.mockResolvedValue(app as unknown as AppFastifyInstance)

    await start()

    expect(app.log.error).toHaveBeenCalledWith({ err: expect.any(Error) }, 'Unable to start server')
    expect(processExitSpy).toHaveBeenCalledWith(1)

    processExitSpy.mockRestore()
  })
})
