import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, dirname } from 'node:path'

import { generateEndpoints } from '@rtk-query/codegen-openapi'

const OPENAPI_FILE = '@powercoach/api/openapi.json' as const

const require = createRequire(import.meta.url)
const resolvedApiDir = dirname(require.resolve('@/core/api'))
const resolvedHooksDir = dirname(require.resolve('@/core/hooks'))
const resolvedGeneratedApiDir = join(resolvedApiDir, 'generated')
const resolvedGeneratedPendingQueriesFile = join(resolvedHooksDir, 'usePendingQuery.generated.ts')

function generatePendingQueriesContent(content: string): string {
  const match = content.matchAll(/\buse(?!Lazy)[A-Z]\w+Query\b/g)
  const hooks = Array.from(match, ([hook]) => hook)

  if (!hooks.length) {
    return 'export type GeneratedQueryHook = never\n'
  }

  const importHookString = `import { usePendingQuery } from './usePendingQuery'`
  const importApiHooksString = `import { ${hooks.join(', ')} } from '../api'`

  const pendingQueriesHooks = hooks.map((hook) => {
    return `export const usePending${hook.replace('use', '')} = usePendingQuery(${hook})`
  })

  return [importHookString, importApiHooksString, pendingQueriesHooks.join('\n')].join('\n\n')
}

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

rmSync(resolvedGeneratedApiDir, { force: true, recursive: true })
rmSync(resolvedGeneratedPendingQueriesFile, { force: true, recursive: true })

mkdirSync(resolvedGeneratedApiDir)

const apiIndexFile = join(resolvedGeneratedApiDir, 'index.generated.ts')

await generateEndpoints({
  apiFile: './src/core/api/apiSlice.ts',
  apiImport: 'apiSlice',
  exportName: 'api',
  hooks: {
    lazyQueries: true,
    mutations: true,
    queries: true
  },
  outputFile: apiIndexFile,
  schemaFile: resolvedOpenapiFile
})

writeFileSync(
  resolvedGeneratedPendingQueriesFile,
  generatePendingQueriesContent(readFileSync(apiIndexFile, 'utf-8') ?? ''),
  'utf-8'
)

writeFileSync(
  join(resolvedGeneratedApiDir, 'index.ts'),
  "export * from './index.generated'",
  'utf-8'
)

if (!process.argv.includes('--quiet')) {
  console.info('✅ src/core/api/generated/index.generated.ts')
  console.info('✅ src/core/hooks/generated/usePendingQuery.generated.ts')
}
