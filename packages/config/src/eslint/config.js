import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import { ignoreConfig } from './ignoreConfig.js'
import { sharedStyleConfig } from './sharedStyleConfig.js'
import { typescriptConfig, typescriptTestConfig } from './typescriptConfig.js'

/** @type {import('eslint').Linter.Config[]} */
export const config = [
  ignoreConfig,
  sharedStyleConfig,
  js.configs.recommended,
  typescriptConfig,
  typescriptTestConfig,
  prettierConfig
]
