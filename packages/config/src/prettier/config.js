import sortJsonPlugin from 'prettier-plugin-sort-json'

/** @type {import('prettier').Config} */
export const config = {
  arrowParens: 'always',
  plugins: [sortJsonPlugin],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none'
}
