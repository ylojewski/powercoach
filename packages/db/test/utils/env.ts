import { Env } from '@/src/core'

export function stubEnv(appConfig: Partial<Env>) {
  if (appConfig.DATABASE_URL) {
    vi.stubEnv('DATABASE_URL', appConfig.DATABASE_URL)
  }
  if (appConfig.NODE_ENV) {
    vi.stubEnv('NODE_ENV', appConfig.NODE_ENV)
  }
}
