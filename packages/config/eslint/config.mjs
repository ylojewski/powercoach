import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'

const strictRules = tseslint.configs.strict?.rules ?? {}
const stylisticRules = tseslint.configs.stylistic?.rules ?? {}

export const ignoreConfig = {
  ignores: ['dist']
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
    import: importPlugin
  },
  rules: {
    ...strictRules,
    ...stylisticRules,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }
    ]
  }
}

export const config = [ignoreConfig, js.configs.recommended, typescriptConfig, prettierConfig]
