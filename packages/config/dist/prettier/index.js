import sortJsonPlugin from 'prettier-plugin-sort-json';

// src/prettier/config.ts
var config = {
  arrowParens: "always",
  jsonRecursiveSort: true,
  overrides: [{ files: "package.json", options: { parser: "json" } }],
  plugins: [sortJsonPlugin],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "none"
};

export { config };
