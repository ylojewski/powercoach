import type { AppConfig } from '@/core/config/envSchema'
import { buildApp, type AppFastifyInstance } from '@/app/buildApp'

export interface MakeAppResult {
  app: AppFastifyInstance
  inject: AppFastifyInstance['inject']
  close: () => Promise<void>
  config: AppConfig
}

const defaultConfig: AppConfig = {
  HOST: '127.0.0.1',
  LOG_LEVEL: 'silent',
  NODE_ENV: process.env.NODE_ENV ?? 'test',
  PORT: 0
}

export async function makeApp(overrides: Partial<AppConfig> = {}): Promise<MakeAppResult> {
  const config: AppConfig = Object.freeze({ ...defaultConfig, ...overrides }) as AppConfig
  const app = await buildApp({ config })

  return {
    app,
    close: async () => {
      await app.close()
    },
    config,
    inject: app.inject.bind(app)
  }
}
