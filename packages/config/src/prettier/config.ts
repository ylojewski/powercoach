import { type Config } from 'prettier'
import sortJsonPlugin from 'prettier-plugin-sort-json'
import * as tailwindcssPlugin from 'prettier-plugin-tailwindcss'

import { packageJsonSortOrder } from './packageJsonSortOrder'

export const config: Config = {
  arrowParens: 'always',
  jsonRecursiveSort: true,
  overrides: [
    { files: 'package.json', options: { jsonSortOrder: packageJsonSortOrder, parser: 'json' } },
    { files: '**/*.svg', options: { parser: 'html' } }
  ],
  plugins: [sortJsonPlugin, tailwindcssPlugin],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  tailwindFunctions: ['clsx', 'cn', 'cva', 'twMerge'],
  trailingComma: 'none'
}
