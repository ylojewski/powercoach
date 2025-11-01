import sortJsonPlugin from 'prettier-plugin-sort-json'
import type { Config, Plugin } from 'prettier'

const sortJson = sortJsonPlugin as Plugin

export const config = {
  arrowParens: 'always',
  plugins: [sortJson],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none'
} satisfies Config
