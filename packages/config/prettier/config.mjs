import sortJsonPlugin from 'prettier-plugin-sort-json'

export const config = {
  arrowParens: 'always',
  jsonRecursiveSort: true,
  plugins: [sortJsonPlugin],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none'
}
