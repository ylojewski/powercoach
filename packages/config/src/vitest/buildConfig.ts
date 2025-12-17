import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { type ViteUserConfig } from 'vitest/config'

export interface Config {
  exclude?: string[]
  globalSetup?: boolean | string
  include?: string[]
  setup?: boolean | string
}

export function buildConfig(importUrl: string, config?: Config): ViteUserConfig {
  const { exclude, globalSetup, include, setup } = config ?? {}

  const importPath = fileURLToPath(importUrl)
  const importDir = dirname(importPath)

  const globalSetupFile = globalSetup === true ? 'test/globalSetup.ts' : globalSetup || ''
  const setupFile = setup === true ? 'test/setup.ts' : setup || ''

  return {
    resolve: {
      alias: {
        '@/scripts': resolve(importDir, 'scripts'),
        '@/src': resolve(importDir, 'src'),
        '@/test': resolve(importDir, 'test')
      }
    },
    test: {
      coverage: {
        exclude: [
          'src/**/index.{ts,tsx}',
          'src/**/*.test.{ts,tsx}',
          'src/**/*.d.ts',
          'test',
          ...(exclude ?? [])
        ],
        include: ['src/**/*.{ts,tsx}', ...(include ?? [])],
        provider: 'v8',
        reporter: ['text', 'json', 'lcov'],
        reportsDirectory: 'coverage',
        thresholds: {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100
        }
      },
      globals: true,
      ...(globalSetupFile && { globalSetup: [globalSetupFile] }),
      ...(setupFile && { setupFiles: [setupFile] })
    }
  }
}
