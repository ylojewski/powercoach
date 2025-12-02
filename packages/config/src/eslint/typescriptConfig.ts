import process from 'node:process'

import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import { type Linter } from 'eslint'
import globals from 'globals'

const strictRules = tseslint.configs.strict?.rules ?? {}
const stylisticRules = tseslint.configs.stylistic?.rules ?? {}

export const typescriptConfig: Linter.Config = {
  files: ['**/*.{ts,tsx}'],
  ignores: ['**/*.test.{ts,tsx}', 'test/**/*.{ts,tsx}'],
  languageOptions: {
    globals: {
      ...globals.node
    },
    parser: tsparser,
    parserOptions: {
      project: ['./tsconfig.src.json'],
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

export const typescriptTestConfig: Linter.Config = {
  ...typescriptConfig,
  files: ['**/*.test.{ts,tsx}', 'test/**/*.{ts,tsx}'],
  ignores: [],
  languageOptions: {
    ...typescriptConfig.languageOptions,
    globals: {
      ...(typescriptConfig.languageOptions?.globals ?? {}),
      ...globals.vitest
    },
    parserOptions: {
      ...(typescriptConfig.languageOptions?.parserOptions ?? {}),
      project: ['./tsconfig.test.json']
    }
  }
}
