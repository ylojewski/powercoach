export const config = {
  '*.{js,jsx,ts,tsx,json,md,css,scss,html}': () => [
    'pnpm lint -- --fix',
    'pnpm format -- --write',
  ],
}


