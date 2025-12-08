import { type Linter } from 'eslint'
import importPlugin from 'eslint-plugin-import'

export const sharedStyleConfig: Linter.Config = {
  plugins: {
    import: importPlugin
  },
  rules: {
    'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
    'import/first': 'error',
    'import/no-duplicates': ['error', { 'prefer-inline': true }],
    'import/order': [
      'error',
      {
        alphabetize: { caseInsensitive: true, order: 'asc' },
        distinctGroup: true,
        groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index']],
        'newlines-between': 'always',
        pathGroups: [{ group: 'internal', pattern: '@/**', position: 'before' }]
      }
    ],
    'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: true }],
    'sort-keys': [
      'error',
      'asc',
      {
        allowLineSeparatedGroups: true,
        caseSensitive: false,
        minKeys: 2,
        natural: false
      }
    ]
  }
}
