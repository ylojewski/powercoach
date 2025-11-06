import process from 'node:process'

import { buildApp } from '@/src/app'
import { loadConfig } from '@/src/core'

type ShutdownSignal = 'SIGINT' | 'SIGTERM'

export async function start() {
  const config = loadConfig()
  const app = await buildApp({ config })

  const closeApp = async () => {
    try {
      await app.close()
      app.log.info('Server closed gracefully')
    } catch (error) {
      app.log.error({ err: error }, 'Error during shutdown')
    } finally {
      process.exit(0)
    }
  }

  const handleSignal = (signal: ShutdownSignal) => {
    app.log.info({ signal }, 'Received shutdown signal')
    void closeApp()
  }

  process.on('SIGINT', handleSignal)
  process.on('SIGTERM', handleSignal)

  process.on('unhandledRejection', (reason) => {
    app.log.error({ reason }, 'Unhandled rejection')
    void closeApp()
  })

  process.on('uncaughtException', (error) => {
    app.log.error({ err: error }, 'Uncaught exception')
    void closeApp()
  })

  try {
    const address = await app.listen({ host: config.HOST, port: config.PORT })
    app.log.info({ address }, 'Server listening')
  } catch (error) {
    app.log.error({ err: error }, 'Unable to start server')
    process.exit(1)
  }
}
