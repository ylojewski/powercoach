import { config, vitestConfig } from '@powercoach/config/eslint'
import process from 'node:process'

const [ignoreConfig, sharedStyleConfig, jsConfig, typescriptConfig, prettierConfig] = config

const apiTypescriptConfig = {
  ...typescriptConfig,
  languageOptions: {
    ...typescriptConfig.languageOptions,
    parserOptions: {
      ...(typescriptConfig.languageOptions?.parserOptions ?? {}),
      project: ['./tsconfig.src.json'],
      tsconfigRootDir: process.cwd()
    }
  }
}

const apiVitestConfig = {
  ...vitestConfig,
  languageOptions: {
    ...vitestConfig.languageOptions,
    parserOptions: {
      ...(vitestConfig.languageOptions?.parserOptions ?? {}),
      project: ['./tsconfig.test.json'],
      tsconfigRootDir: process.cwd()
    }
  }
}

export default [
  ignoreConfig,
  sharedStyleConfig,
  jsConfig,
  apiTypescriptConfig,
  prettierConfig,
  apiVitestConfig
]
