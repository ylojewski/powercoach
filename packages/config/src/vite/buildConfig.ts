import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { type UserConfig } from 'vite'

import { buildConfig as buildVitestConfig } from '@/src/vitest'

export function buildConfig(importUrl: string): UserConfig {
  const importPath = fileURLToPath(importUrl)
  const importDir = dirname(importPath)

  return {
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    plugins: [react()],
    preview: {
      port: 4173,
      strictPort: true
    },
    resolve: {
      alias: {
        '@/src': path.resolve(importDir, './src'),
        '@/test': path.resolve(importDir, './test')
      }
    },
    server: {
      port: 3000,
      strictPort: true
    },
    test: {
      ...buildVitestConfig(importUrl).test,
      environment: 'jsdom',
      setupFiles: ['test/setup.ts']
    }
  }
}
