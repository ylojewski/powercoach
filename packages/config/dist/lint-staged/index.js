// src/lint-staged/config.ts
var config = {
  "*.{js,jsx,ts,tsx,json,md,css,scss,html}": ["pnpm lint:fix --", "pnpm format:write --"]
};

export { config };
