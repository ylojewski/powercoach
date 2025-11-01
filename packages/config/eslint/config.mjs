import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const strictRules = tseslint.configs.strict?.rules ?? {}
const stylisticRules = tseslint.configs.stylistic?.rules ?? {}

const tsconfigCandidates = ['./tsconfig.src.json', './tsconfig.json']
const tsconfigProjectFiles = tsconfigCandidates.filter((candidate) =>
  existsSync(resolve(process.cwd(), candidate))
)

export const ignoreConfig = {
  ignores: ['dist']
}

const sharedStyleConfig = {
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

export const typescriptConfig = {
  files: ['**/*.{ts,tsx}'],
  ignores: ['**/*.test.{ts,tsx}', 'test/**/*.ts'],
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      project: tsconfigProjectFiles.length > 0 ? tsconfigProjectFiles : ['./tsconfig.json'],
      tsconfigRootDir: process.cwd(),
      sourceType: 'module'
    }
  },
  plugins: {
    '@typescript-eslint': tseslint
  },
  rules: {
    ...strictRules,
    ...stylisticRules,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/return-await': ['error', 'never']
  }
}

export const config = [
  ignoreConfig,
  sharedStyleConfig,
  js.configs.recommended,
  typescriptConfig,
  prettierConfig
]

export const vitestConfig = {
  files: ['**/*.test.{ts,tsx}', 'test/**/*.ts'],
  languageOptions: {
    ...typescriptConfig.languageOptions,
    globals: {
      ...globals.node,
      ...globals.vitest
    },
    parserOptions: {
      ...(typescriptConfig.languageOptions?.parserOptions ?? {}),
      project: ['./tsconfig.test.json'],
      tsconfigRootDir: process.cwd(),
      sourceType: 'module'
    }
  },
  plugins: {
    ...typescriptConfig.plugins
  },
  rules: {
    ...typescriptConfig.rules
  }
}
