import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import perfectionist from 'eslint-plugin-perfectionist'
import prettierConfig from 'eslint-config-prettier'

const strictRules = tseslint.configs.strict?.rules ?? {}
const stylisticRules = tseslint.configs.stylistic?.rules ?? {}

export const ignoreConfig = {
  ignores: ['dist']
}

const sortObjectsRules = {
  'perfectionist/sort-objects': [
    'error',
    {
      order: 'asc',
      type: 'natural'
    }
  ]
}

const sharedStyleConfig = {
  plugins: {
    perfectionist
  },
  rules: {
    ...sortObjectsRules
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
    '@typescript-eslint': tseslint,
    import: importPlugin,
    perfectionist
  },
  rules: {
    ...strictRules,
    ...stylisticRules,
    ...sortObjectsRules,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'import/order': [
      'error',
      {
        alphabetize: { caseInsensitive: true, order: 'asc' },
        'newlines-between': 'always'
      }
    ]
  }
}

export const config = [
  ignoreConfig,
  sharedStyleConfig,
  js.configs.recommended,
  typescriptConfig,
  prettierConfig
]
