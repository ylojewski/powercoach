import { type Configuration } from 'lint-staged'

export const config: Configuration = {
  '*.{js,jsx,ts,tsx,json,md,css,scss,html}': ['pnpm lint:fix --', 'pnpm format:write --']
}
