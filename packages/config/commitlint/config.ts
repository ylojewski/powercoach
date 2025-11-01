import type { UserConfig } from '@commitlint/types'

export const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-empty': [2, 'never']
  }
}
