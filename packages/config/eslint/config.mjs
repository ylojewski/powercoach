import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import boundariesPlugin from 'eslint-plugin-boundaries'
import importPlugin from 'eslint-plugin-import'

const strictRules = tseslint.configs.strict?.rules ?? {}
const stylisticRules = tseslint.configs.stylistic?.rules ?? {}

export const ignoreConfig = {
  ignores: ['dist']
}

const sharedStyleConfig = {
  plugins: {
    import: importPlugin,
    boundaries: boundariesPlugin
  },
  settings: {
    'boundaries/elements': [
      {
        type: 'package',
        pattern: 'packages/*'
      },
      {
        type: 'app',
        pattern: 'apps/*'
      }
    ]
  },
  rules: {
    'import/first': 'error',
    'boundaries/no-private': ['error', { allowUncles: false }],
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
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      project: ['./tsconfig.json'],
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
