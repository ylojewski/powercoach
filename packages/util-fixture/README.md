# @powercoach/util-fixture

Shared fixture constants used across Powercoach packages.

## What it includes

- Demo data used by the seeded API/database experience.
- Shared environment primitives that package-specific test fixtures can compose.

## Usage

```ts
import { COACH, DEFAULT_ORGANIZATION, TEST_DATABASE_URL } from '@powercoach/util-fixture'

console.log(COACH.email)
console.log(DEFAULT_ORGANIZATION.name)
console.log(TEST_DATABASE_URL)
```

Fixtures are exported as small immutable constants so packages can compose scenario-specific test
data without repeating the shared base values.
