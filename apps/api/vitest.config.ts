import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  resolve: {
    alias: {
      '@/src': resolve(__dirname, 'src'),
      '@/test': resolve(__dirname, 'test')
    }
  },
  test: {
    coverage: {
      exclude: ['src/**/index.ts', 'src/**/*.test.ts', 'src/**/*.d.ts', 'test/**/*.ts'],
      include: ['src/**/*.ts'],
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
})
