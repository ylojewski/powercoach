import { type Linter } from 'eslint'
import globals from 'globals'

export const webConfig: Linter.Config = {
  languageOptions: {
    globals: {
      ...globals.browser
    }
  }
}
