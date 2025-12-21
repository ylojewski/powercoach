import sortJsonPlugin from 'prettier-plugin-sort-json';

// src/prettier/config.ts

// src/prettier/packageJsonSortOrder.ts
var packageJsonSortMap = /* @__PURE__ */ new Map([
  [/^name$/, null],
  [/^version$/, null],
  [/^scripts/, null],
  [/^exports$/, null],
  [/^(d|devD|peerD)ependencies$/, "lexical"],
  [/^types$/, null],
  [/^style$/, null],
  [/^require$/, null],
  [/^import$/, null],
  [/.*/, "lexical"]
]);
var packageJsonSortOrder = JSON.stringify(Object.fromEntries(packageJsonSortMap));

// src/prettier/config.ts
var config = {
  arrowParens: "always",
  jsonRecursiveSort: true,
  overrides: [{ files: "package.json", options: { jsonSortOrder: packageJsonSortOrder, parser: "json" } }],
  plugins: [sortJsonPlugin],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "none"
};

export { config };
