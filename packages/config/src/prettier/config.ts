import { type Config } from 'prettier'
import sortJsonPlugin from 'prettier-plugin-sort-json'

import { packageJsonSortOrder } from './packageJsonSortOrder'

export const config: Config = {
  arrowParens: 'always',
  jsonRecursiveSort: true,
  overrides: [
    { files: 'package.json', options: { jsonSortOrder: packageJsonSortOrder, parser: 'json' } }
  ],
  plugins: [sortJsonPlugin],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none'
}
