import { type Config } from 'drizzle-kit'

export function buildConfig({ databaseUrl }: { databaseUrl: string }): Config {
  return {
    dbCredentials: {
      url: databaseUrl
    },
    dialect: 'postgresql',
    out: './src/migrations',
    schema: './src/schema'
  }
}
