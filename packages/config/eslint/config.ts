/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./eslint-config-prettier.d.ts" />
/* eslint-enable @typescript-eslint/triple-slash-reference */
import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import process from 'node:process'
import type { Linter } from 'eslint'

type FlatConfig = Linter.FlatConfig
type RulesRecord = Linter.RulesRecord
type PluginDefinition = NonNullable<FlatConfig['plugins']>[string]

const strictRules = (tseslint.configs.strict?.rules ?? {}) as RulesRecord
const stylisticRules = (tseslint.configs.stylistic?.rules ?? {}) as RulesRecord
const typescriptPlugin = tseslint as unknown as PluginDefinition

export const ignoreConfig: FlatConfig = {
  ignores: ['dist']
}

const sharedStyleConfig: FlatConfig = {
  plugins: {
    import: importPlugin
  },
  rules: {
    'import/first': 'error',
    'import/no-relative-parent-imports': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc'
        },
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index'],
          'object',
          'type',
          'unknown'
        ],
        'newlines-between': 'never',
        pathGroupsExcludedImportTypes: ['type']
      }
    ]
  }
}

type ParserProjectOption = string | string[] | null | undefined

const toProjectArray = (parserProjectOption: ParserProjectOption): string[] | undefined => {
  if (!parserProjectOption) {
    return undefined
  }

  if (Array.isArray(parserProjectOption)) {
    return parserProjectOption
  }

  return [parserProjectOption]
}

export const createTypescriptConfig = (parserProjectOption?: string | string[]): FlatConfig => {
  const project = toProjectArray(parserProjectOption)

  return {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}', 'test/**/*.ts', '**/*.d.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ...(project ? { project } : {}),
        tsconfigRootDir: process.cwd(),
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin
    },
    rules: {
      ...strictRules,
      ...stylisticRules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/return-await': ['error', 'never']
    }
  }
}

export const typescriptConfig = createTypescriptConfig('./tsconfig.json')

export const config: FlatConfig[] = [
  ignoreConfig,
  sharedStyleConfig,
  js.configs.recommended as FlatConfig,
  typescriptConfig,
  prettierConfig as FlatConfig
]

export const createTestConfig = (parserProjectOption?: string | string[]): FlatConfig => {
  const base = createTypescriptConfig(parserProjectOption)

  return {
    ...base,
    files: ['**/*.test.{ts,tsx}', 'test/**/*.ts'],
    ignores: [],
    languageOptions: {
      ...base.languageOptions,
      globals: {
        ...globals.node,
        ...globals.vitest
      }
    }
  }
}

export const testConfig = createTestConfig('./tsconfig.test.json')
