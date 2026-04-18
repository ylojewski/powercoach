import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { type TestProject } from 'vitest/node'

declare module 'vitest' {
  export interface ProvidedContext {
    adminDatabaseUrl: string
  }
}

export default async function ({ provide }: TestProject) {
  const container = await new PostgreSqlContainer('postgres:16').start()

  provide('adminDatabaseUrl', container.getConnectionUri())

  return () => {
    container.stop()
  }
}
