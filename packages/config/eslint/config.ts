import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import type { ESLint, Linter } from 'eslint'

type FlatConfigEntry = Linter.Config

type ParserProjectOption = string | string[] | undefined

type TypescriptParserOptions = Linter.ParserOptions & {
  project?: ParserProjectOption
  tsconfigRootDir?: string
}

type FlatConfigPlugins = Exclude<FlatConfigEntry['plugins'], null | undefined>

type TypescriptLanguageOptions = Linter.LanguageOptions & {
  parser: typeof tsparser
  parserOptions: TypescriptParserOptions
}

const strictRules = tseslint.configs.strict?.rules ?? {}
const stylisticRules = tseslint.configs.stylistic?.rules ?? {}

export const ignoreConfig: FlatConfigEntry = {
  ignores: ['dist', '**/*.d.ts']
}

const sharedStylePlugins: FlatConfigPlugins = {
  import: importPlugin
}

const sharedStyleConfig: FlatConfigEntry = {
  plugins: sharedStylePlugins,
  languageOptions: {
    globals: globals.node
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
} satisfies FlatConfigEntry

const createLanguageOptions = (
  parserProjectOption?: ParserProjectOption
): TypescriptLanguageOptions => ({
  parser: tsparser,
  parserOptions: {
    ...(parserProjectOption ? { project: parserProjectOption } : {}),
    tsconfigRootDir: process.cwd(),
    sourceType: 'module'
  }
})

export const createTypescriptConfig = (
  parserProjectOption?: ParserProjectOption
): FlatConfigEntry => ({
  files: ['**/*.{ts,tsx}'],
  ignores: ['**/*.test.{ts,tsx}', 'test/**/*.ts'],
  languageOptions: {
    ...createLanguageOptions(parserProjectOption),
    globals: globals.node
  },
  plugins: {
    '@typescript-eslint': tseslint as unknown as ESLint.Plugin
  } satisfies FlatConfigPlugins,
  rules: {
    ...strictRules,
    ...stylisticRules,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/return-await': ['error', 'never']
  }
})

export const typescriptConfig = createTypescriptConfig('./tsconfig.json')

export const config: FlatConfigEntry[] = [
  ignoreConfig,
  sharedStyleConfig,
  js.configs.recommended,
  typescriptConfig,
  prettierConfig
]

export const createTestConfig = (parserProjectOption?: ParserProjectOption): FlatConfigEntry => {
  const base = createTypescriptConfig(parserProjectOption)

  return {
    ...base,
    files: ['**/*.test.{ts,tsx}', 'test/**/*.ts'],
    ignores: [],
    languageOptions: {
      ...(base.languageOptions ?? {}),
      globals: {
        ...globals.node,
        ...globals.vitest
      }
    }
  }
}

export const testConfig = createTestConfig('./tsconfig.test.json')
