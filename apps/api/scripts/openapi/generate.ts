import { mkdirSync, writeFileSync } from 'node:fs'

import { NodeEnv } from '@powercoach/util-env'

import { createBaseApp, registerCoreModules, registerCorePlugins } from '@/src/app'
import { type Env } from '@/src/core'
import { swaggerPlugin } from '@/src/plugins'
import { LogLevel } from '@/src/types'

export const ENV: Env = {
  DATABASE_URL: 'postgres://powercoach:powercoach@127.0.0.1:5432/powercoach',
  HOST: '127.0.0.1',
  LOG_LEVEL: LogLevel.silent,
  NODE_ENV: NodeEnv.production,
  PORT: 8080
} as const

export async function buildOpenAPIApp(env: Env) {
  const app = createBaseApp(env)

  await registerCorePlugins(app)
  await app.register(swaggerPlugin)
  await registerCoreModules(app)

  return app
}

const app = await buildOpenAPIApp(ENV)
await app.ready()

const content = `${JSON.stringify(app.swagger(), null, 2)}\n`

mkdirSync('dist', { recursive: true })
writeFileSync('dist/openapi.json', content, 'utf8')

await app.close()

if (!process.argv.includes('--quiet')) {
  console.info('✅ dist/openapi.json')
}
