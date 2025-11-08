import process from 'node:process'

import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import globals from 'globals'

const strictRules = tseslint.configs.strict?.rules ?? {}
const stylisticRules = tseslint.configs.stylistic?.rules ?? {}

/** @type {any} */
const tseslintPlugin = tseslint

/** @type {import('eslint').Linter.Config} */
export const typescriptConfig = {
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
    '@typescript-eslint': tseslintPlugin
  },
  rules: {
    ...strictRules,
    ...stylisticRules,
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/return-await': ['error', 'never']
  }
}

/** @type {import('eslint').Linter.Config} */
export const typescriptTestConfig = {
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
