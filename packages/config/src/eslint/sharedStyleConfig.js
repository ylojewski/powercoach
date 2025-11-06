import importPlugin from 'eslint-plugin-import'

/** @type {import('eslint').Linter.Config} */
export const sharedStyleConfig = {
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
        pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }]
      }
    ]
  }
}
