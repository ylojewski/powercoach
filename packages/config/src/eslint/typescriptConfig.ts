import process from 'node:process'

import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import { type Linter } from 'eslint'
import globals from 'globals'

const strictRules = tseslint.configs.strict?.rules ?? {}
const stylisticRules = tseslint.configs.stylistic?.rules ?? {}

export function buildTypescriptConfig(project: string): Linter.Config {
  return {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}', 'test/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node
      },
      parser: tsparser,
      parserOptions: {
        project: [project],
        sourceType: 'module',
        tsconfigRootDir: process.cwd()
      }
    },
    plugins: {
      '@typescript-eslint': tseslint as unknown
    } as Linter.Config['plugins'],
    rules: {
      ...strictRules,
      ...stylisticRules,
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrors: 'none' }
      ],
      '@typescript-eslint/return-await': ['error', 'never']
    }
  }
}

export const typescriptConfig: Linter.Config = buildTypescriptConfig('./tsconfig.src.json')

export function buildTypescriptTestConfig(files: string[], project: string): Linter.Config {
  return {
    ...typescriptConfig,
    files,
    ignores: [],
    languageOptions: {
      ...typescriptConfig.languageOptions,
      globals: {
        ...(typescriptConfig.languageOptions?.globals ?? {}),
        ...globals.vitest
      },
      parserOptions: {
        ...(typescriptConfig.languageOptions?.parserOptions ?? {}),
        project: [project]
      }
    }
  }
}

export const typescriptTestConfig: Linter.Config = buildTypescriptTestConfig(
  ['**/*.test.{ts,tsx}', 'test/**/*.{ts,tsx}'],
  './tsconfig.test.json'
)
