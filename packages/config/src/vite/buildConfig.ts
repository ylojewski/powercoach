import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, PluginOption, type UserConfigFnObject } from 'vite'
import dts from 'vite-plugin-dts'

import { buildConfig as buildVitestConfig, type Config as VitestConfig } from '@/src/vitest'

export interface Config extends VitestConfig {
  api?: boolean | string
  lib?: boolean | string
  plugins?: PluginOption[]
}

export function buildConfig(importUrl: string, config?: Config): UserConfigFnObject {
  return defineConfig(({ mode }) => {
    const { api, lib, plugins } = config ?? {}

    const importPath = fileURLToPath(importUrl)
    const importDir = dirname(importPath)

    const apiTarget = api === true ? (loadEnv(mode, importDir).VITE_API_BASE_URL ?? '') : api || ''
    const libFile = lib === true ? 'src/index.ts' : lib || ''

    return {
      build: {
        ...(lib && {
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
        ...(plugins ?? []),
        react(),
        lib ? dts({ rollupTypes: true, tsconfigPath: './tsconfig.src.json' }) : null
      ],
      preview: {
        port: 4173,
        strictPort: true
      },
      resolve: {
        alias: {
          '@/scripts': resolve(importDir, 'scripts'),
          '@/src': resolve(importDir, 'src'),
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
        ...buildVitestConfig(importUrl, config).test,
        environment: 'jsdom'
      }
    }
  })
}
