# @powercoach/config

Centralized configuration presets for the Powercoach monorepo. Each config is bundled with tsup and exposed through package exports for consistent linting, formatting, building, and testing across apps and packages.

## What it provides

- **ESLint** presets for TypeScript, React, and shared style rules.
- **Prettier** configuration (including JSON sorting) and ignore rules.
- **TypeScript** project templates for source and test builds.
- **Tsup** build helper (`buildConfig`) for libraries and DTS generation.
- **Vite** base config with React plugin support.
- **Vitest** configuration for unit and coverage runs.
- **Drizzle** CLI configuration for database packages.
- **Commitlint** and **lint-staged** presets to enforce commit hygiene.

## Usage

Import the needed entry point from the package exports:

```js
// eslint.config.js
import { config } from '@powercoach/config/eslint'
export default config

// tsup.config.js
import { buildConfig } from '@powercoach/config/tsup'
export default buildConfig(import.meta.url)

// vite.config.js
import { buildConfig } from '@powercoach/config/vite'
export default buildConfig(import.meta.url)
```

See the `src` directory for the full list of available configs and helpers.
