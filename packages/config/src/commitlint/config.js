/**
 * @type {import('@commitlint/types').UserConfig}
 */
export const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-empty': [2, 'never']
  }
}
