import { AppConfig } from '@/src/core'

export function stubEnv(appConfig: Partial<AppConfig>) {
  if (appConfig.HOST) {
    vi.stubEnv('HOST', appConfig.HOST)
  }
  if (appConfig.LOG_LEVEL) {
    vi.stubEnv('LOG_LEVEL', appConfig.LOG_LEVEL)
  }
  if (appConfig.NODE_ENV) {
    vi.stubEnv('NODE_ENV', appConfig.NODE_ENV)
  }
  if (appConfig.PORT) {
    vi.stubEnv('PORT', `${appConfig.PORT}`)
  }
}
