import { type Config } from 'prettier'
import sortJsonPlugin from 'prettier-plugin-sort-json'

export const config: Config = {
  arrowParens: 'always',
  jsonRecursiveSort: true,
  plugins: [sortJsonPlugin],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none'
}
