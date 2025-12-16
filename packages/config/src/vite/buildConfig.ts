import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type UserConfigFnObject } from 'vite'
import dts from 'vite-plugin-dts'

import { buildConfig as buildVitestConfig, type Config as VitestConfig } from '@/src/vitest'

export type Config = Omit<VitestConfig, 'lib'> & {
  api?: boolean | string
  lib?: boolean | string
}

export function buildConfig(importUrl: string, config?: Config): UserConfigFnObject {
  return defineConfig(({ mode }) => {
    const { api, lib } = config ?? {}

    const importPath = fileURLToPath(importUrl)
    const importDir = dirname(importPath)

    const apiTarget = api === true ? (loadEnv(mode, importDir).VITE_API_BASE_URL ?? '') : api || ''
    const libFile = lib === true ? 'lib/index.ts' : lib || ''

    const rootDir = libFile ? 'lib' : 'src'

    return {
      build: {
        ...(libFile && {
          lib: {
            entry: resolve(importDir, libFile),
            fileName: 'index',
            formats: ['es']
          },
          rollupOptions: {
            external: ['react'],
            output: { globals: { react: 'React' } }
          }
        }),
        outDir: 'dist',
        sourcemap: true
      },
      plugins: [
        react(),
        (libFile && dts({ rollupTypes: true, tsconfigPath: './tsconfig.lib.json' })) || null
      ],
      preview: {
        port: 4173,
        strictPort: true
      },
      resolve: {
        alias: {
          [`@/${rootDir}`]: resolve(importDir, rootDir),
          '@/scripts': resolve(importDir, 'scripts'),
          '@/test': resolve(importDir, 'test')
        }
      },
      server: {
        host: 'localhost',
        port: 3000,
        proxy: {
          ...(api && {
            '/api': {
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
              secure: false,
              target: apiTarget
            }
          })
        },
        strictPort: true
      },
      test: {
        ...buildVitestConfig(importUrl, { ...config, lib: Boolean(config?.lib) }).test,
        environment: 'jsdom'
      }
    }
  })
}
