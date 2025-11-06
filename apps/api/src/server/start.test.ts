import process from 'node:process'

import { expect, MockedFunction } from 'vitest'

import { AppFastifyInstance, buildApp } from '@/src/app'
import { loadConfig } from '@/src/core'
import { testConfig } from '@/test/fixtures'
import { expectFunction, flushAsync } from '@/test/utils'

import { start } from './start'

vi.mock('@/src/app', () => ({
  buildApp: vi.fn()
}))

vi.mock('@/src/core', () => ({
  loadConfig: vi.fn()
}))

const buildAppMock = buildApp as MockedFunction<typeof buildApp>
const loadConfigMock = loadConfig as MockedFunction<typeof loadConfig>

describe('start', () => {
  beforeEach(() => {
    buildAppMock.mockReset()
    loadConfigMock.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts the server and wires shutdown handlers', async () => {
    loadConfigMock.mockReturnValue(testConfig)
    const address = `http://${testConfig.HOST}:${testConfig.PORT}`

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

    expect(loadConfigMock).toHaveBeenCalledTimes(1)
    expect(buildAppMock).toHaveBeenCalledWith({ config: testConfig })
    expect(app.listen).toHaveBeenCalledWith({ host: testConfig.HOST, port: testConfig.PORT })
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
    loadConfigMock.mockReturnValue(testConfig)

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
