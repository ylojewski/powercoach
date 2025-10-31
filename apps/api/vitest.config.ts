import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@test': resolve(__dirname, 'test')
    }
  },
  test: {
    globals: true
  },
  coverage: {
    provider: 'v8',
    reportsDirectory: 'coverage',
    reporter: ['text', 'json', 'lcov'],
    include: ['src/**/*.ts'],
    exclude: ['src/**/index.ts', 'src/**/*.test.ts', 'src/**/*.d.ts'],
    thresholds: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
})
