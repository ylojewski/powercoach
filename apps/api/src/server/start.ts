import process from 'node:process'

import { buildApp } from '../app'
import { loadConfig } from '../core'

type Signals = Exclude<Parameters<typeof process.kill>[1], number>

export async function start() {
  const config = loadConfig()
  const app = await buildApp({ config })

  const closeApp = async () => {
    try {
      await app.close()
      app.log.info('Fastify instance closed gracefully')
    } catch (error) {
      app.log.error({ err: error }, 'Error during Fastify shutdown')
    } finally {
      process.exit(0)
    }
  }

  const handleSignal = (signal: Signals) => {
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
    const address = await app.listen({ port: config.PORT, host: config.HOST })
    app.log.info({ address }, 'Server listening')
    return { app, address }
  } catch (error) {
    app.log.error({ err: error }, 'Unable to start server')
    process.exit(1)
  }
}

if (process.env.NODE_ENV !== 'test' && import.meta.url === `file://${process.argv[1]}`) {
  void start()
}
