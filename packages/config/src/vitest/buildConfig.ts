import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { type ViteUserConfig } from 'vitest/config'

interface Config {
  exclude?: string[]
  include?: string[]
}

export function buildConfig(importUrl: string, config?: Config): ViteUserConfig {
  const importPath = fileURLToPath(importUrl)
  const importDir = dirname(importPath)

  return {
    resolve: {
      alias: {
        '@/scripts': path.resolve(importDir, './scripts'),
        '@/src': path.resolve(importDir, './src'),
        '@/test': path.resolve(importDir, './test')
      }
    },
    test: {
      coverage: {
        exclude: [
          'src/**/index.{ts,tsx}',
          'src/**/*.{test,spec}.{ts,tsx}',
          'src/**/*.d.ts',
          'test',
          ...(config?.exclude ?? [])
        ],
        include: ['src/**/*.{ts,tsx}', ...(config?.include ?? [])],
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
      globals: true
    }
  }
}
