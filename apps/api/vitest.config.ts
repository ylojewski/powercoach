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
  coverage: {
    provider: 'v8',
    reportsDirectory: 'coverage',
    reporter: ['text', 'json', 'lcov'],
    include: [
      'src/app/**/*.ts',
      'src/core/**/*.ts',
      'src/modules/**/*.ts',
      'src/plugins/**/*.ts',
      'src/server/start.ts'
    ],
    exclude: [resolve(__dirname, 'src/index.ts'), resolve(__dirname, 'src/server/index.ts')]
  }
})
