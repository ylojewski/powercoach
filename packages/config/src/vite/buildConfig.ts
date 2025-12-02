import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { type UserConfig } from 'vite'

import { buildConfig as buildVitestConfig } from '@/src/vitest'

interface Config {
  exclude?: string[]
  include?: string[]
}

export function buildConfig(importUrl: string, config?: Config): UserConfig {
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
        '@/scripts': path.resolve(importDir, './scripts'),
        '@/src': path.resolve(importDir, './src'),
        '@/test': path.resolve(importDir, './test')
      }
    },
    server: {
      host: 'localhost',
      port: 3000,
      strictPort: true
    },
    test: {
      ...buildVitestConfig(importUrl, config).test,
      environment: 'jsdom',
      setupFiles: ['test/setup.ts']
    }
  }
}
