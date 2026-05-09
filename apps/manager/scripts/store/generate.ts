import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, dirname } from 'node:path'

import { generateEndpoints } from '@rtk-query/codegen-openapi'
import { OpenAPIV3 as OpenAPI } from 'openapi-types'

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'patch'] as const
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

const openapi = JSON.parse(readFileSync(resolvedOpenapiFile, 'utf8')) as OpenAPI.Document

const operationIdsByTag = ((): Record<string, string[]> => {
  const result: Record<string, string[]> = {}

  for (const pathItem of Object.values(openapi.paths)) {
    if (!pathItem || '$ref' in pathItem) {
      continue
    }

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method]

      if (!operation?.operationId || !operation.tags) {
        continue
      }

      for (const tag of operation.tags) {
        result[tag] ??= []
        if (!result[tag].includes(operation.operationId)) {
          result[tag].push(operation.operationId)
        }
      }
    }
  }

  return result
})()

rmSync(resolvedGeneratedDir, { force: true, recursive: true })
mkdirSync(resolvedGeneratedDir)

const generatedFiles = await Promise.all(
  Object.entries(operationIdsByTag).map(async ([tag, operationIds]) => {
    const generatedFile = `${tag}.generated.ts`

    await generateEndpoints({
      apiFile: './src/core/api/api.ts',
      apiImport: 'api',
      exportName: `${tag}Api`,
      filterEndpoints: operationIds,
      hooks: {
        lazyQueries: true,
        mutations: true,
        queries: true
      },
      outputFile: join(resolvedGeneratedDir, generatedFile),
      schemaFile: resolvedOpenapiFile
    })

    if (!process.argv.includes('--quiet')) {
      console.info(`✅ src/core/api/generated/${tag}.generated.ts`)
    }

    return generatedFile
  })
)

generatedFiles.forEach((generatedFile) => {
  const file = generatedFile.slice(0, -3)
  appendFileSync(join(resolvedGeneratedDir, 'index.ts'), `export * from './${file}'\n`, 'utf-8')
})
