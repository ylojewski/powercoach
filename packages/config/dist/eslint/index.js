import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import process from 'process';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';

// src/eslint/config.ts

// src/eslint/ignoreConfig.ts
var ignoreConfig = {
  ignores: ["dist"]
};
var sharedStyleConfig = {
  plugins: {
    import: importPlugin
  },
  rules: {
    "import/consistent-type-specifier-style": ["error", "prefer-inline"],
    "import/first": "error",
    "import/no-duplicates": ["error", { "prefer-inline": true }],
    "import/order": [
      "error",
      {
        alphabetize: { caseInsensitive: true, order: "asc" },
        distinctGroup: true,
        groups: ["builtin", "external", ["internal", "parent", "sibling", "index"]],
        "newlines-between": "always",
        pathGroups: [{ group: "internal", pattern: "@/**", position: "before" }]
      }
    ],
    "sort-keys": [
      "error",
      "asc",
      {
        allowLineSeparatedGroups: true,
        caseSensitive: false,
        minKeys: 2,
        natural: false
      }
    ]
  }
};
var strictRules = tseslint.configs.strict?.rules ?? {};
var stylisticRules = tseslint.configs.stylistic?.rules ?? {};
var typescriptConfig = {
  files: ["**/*.{ts,tsx}"],
  ignores: ["**/*.test.{ts,tsx}", "test/**/*.{ts,tsx}"],
  languageOptions: {
    globals: {
      ...globals.node
    },
    parser: tsparser,
    parserOptions: {
      project: ["./tsconfig.src.json"],
      sourceType: "module",
      tsconfigRootDir: process.cwd()
    }
  },
  plugins: {
    "@typescript-eslint": tseslint
  },
  rules: {
    ...strictRules,
    ...stylisticRules,
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/return-await": ["error", "never"]
  }
};
var typescriptTestConfig = {
  ...typescriptConfig,
  files: ["**/*.test.{ts,tsx}", "test/**/*.{ts,tsx}"],
  ignores: [],
  languageOptions: {
    ...typescriptConfig.languageOptions,
    globals: {
      ...typescriptConfig.languageOptions?.globals ?? {},
      ...globals.vitest
    },
    parserOptions: {
      ...typescriptConfig.languageOptions?.parserOptions ?? {},
      project: ["./tsconfig.test.json"]
    }
  }
};

// src/eslint/config.ts
var config = [
  ignoreConfig,
  sharedStyleConfig,
  js.configs.recommended,
  typescriptConfig,
  typescriptTestConfig,
  prettierConfig
];

export { config };
