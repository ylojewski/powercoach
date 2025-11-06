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
    parser: tsparser,
    parserOptions: {
      project: ['./tsconfig.src.json'],
      tsconfigRootDir: process.cwd(),
      sourceType: 'module'
    },
    globals: {
      ...globals.node
    }
  },
  plugins: {
    '@typescript-eslint': tseslintPlugin
  },
  rules: {
    ...strictRules,
    ...stylisticRules,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/await-thenable': 'error',
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
    parserOptions: {
      ...(typescriptConfig.languageOptions?.parserOptions ?? {}),
      project: ['./tsconfig.test.json']
    },
    globals: {
      ...(typescriptConfig.languageOptions?.globals ?? {}),
      ...globals.vitest
    }
  }
}
