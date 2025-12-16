import js from '@eslint/js'
import { type Linter } from 'eslint'
import prettierConfig from 'eslint-config-prettier'

import { ignoreConfig } from './ignoreConfig.js'
import { sharedStyleConfig } from './sharedStyleConfig.js'
import { typescriptConfig, typescriptLibConfig, typescriptTestConfig } from './typescriptConfig.js'
import { webConfig } from './webConfig'

export const config: Linter.Config[] = [
  ignoreConfig,
  sharedStyleConfig,
  js.configs.recommended,
  typescriptConfig,
  typescriptTestConfig,
  webConfig,
  prettierConfig
]

export const libConfig: Linter.Config[] = [
  ignoreConfig,
  sharedStyleConfig,
  js.configs.recommended,
  typescriptLibConfig,
  typescriptTestConfig,
  webConfig,
  prettierConfig
]
