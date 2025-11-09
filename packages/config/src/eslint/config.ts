import js from '@eslint/js'
import { type Linter } from 'eslint'
import prettierConfig from 'eslint-config-prettier'

import { ignoreConfig } from './ignoreConfig.js'
import { sharedStyleConfig } from './sharedStyleConfig.js'
import { typescriptConfig, typescriptTestConfig } from './typescriptConfig.js'

export const config: Linter.Config[] = [
  ignoreConfig,
  sharedStyleConfig,
  js.configs.recommended,
  typescriptConfig,
  typescriptTestConfig,
  prettierConfig
]
