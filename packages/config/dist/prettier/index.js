import sortJsonPlugin from 'prettier-plugin-sort-json';
import * as tailwindcssPlugin from 'prettier-plugin-tailwindcss';

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
  overrides: [
    { files: "package.json", options: { jsonSortOrder: packageJsonSortOrder, parser: "json" } },
    { files: "**/*.svg", options: { parser: "html" } }
  ],
  plugins: [sortJsonPlugin, tailwindcssPlugin],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  tailwindFunctions: ["clsx", "cn", "cva", "twMerge"],
  trailingComma: "none"
};

export { config };
