import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, dirname } from 'node:path'

import { generateEndpoints } from '@rtk-query/codegen-openapi'

const OPENAPI_FILE = '@powercoach/api/openapi.json' as const

const require = createRequire(import.meta.url)
const resolvedApiDir = dirname(require.resolve('@/core/api'))
const resolvedGeneratedDir = join(resolvedApiDir, 'generated')
const resolvedOpenapiFile = (() => {
  try {
    const file = require.resolve(OPENAPI_FILE)
    return existsSync(file) ? file : undefined
  } catch {
    return undefined
  }
})()

if (!resolvedOpenapiFile) {
  throw new Error(
    `Missing ${OPENAPI_FILE}. Run "pnpm --filter @powercoach/api openapi:generate" before generating the manager store.`
  )
}

rmSync(resolvedGeneratedDir, { force: true, recursive: true })
mkdirSync(resolvedGeneratedDir)

await generateEndpoints({
  apiFile: './src/core/api/apiSlice.ts',
  apiImport: 'apiSlice',
  exportName: 'api',
  hooks: {
    lazyQueries: true,
    mutations: true,
    queries: true
  },
  outputFile: join(resolvedGeneratedDir, 'index.generated.ts'),
  schemaFile: resolvedOpenapiFile
})

writeFileSync(
  join(resolvedGeneratedDir, 'index.ts'),
  "export * from './index.generated'\n",
  'utf-8'
)

if (!process.argv.includes('--quiet')) {
  console.info('✅ src/core/api/generated/index.generated.ts')
}
