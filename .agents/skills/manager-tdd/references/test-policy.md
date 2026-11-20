# Manager Test Policy

## Stack

Use the manager stack already present in the current manager working directory:

- Vitest.
- `@testing-library/react`.
- `@testing-library/jest-dom`.
- Existing `test/setup.ts`.
- Existing test utilities such as `createTestStore` and `renderWithRouter`.

## Style

- Keep the package's import order.
- Put `vi.mock` calls directly after imports.
- Type mocked functions with `MockedFunction` when relevant.
- Use `describe(<export name>)`.
- Use nested `describe('when ...')` for shared setup.
- Scope typed `let` variables inside the relevant `describe` and override them in `beforeEach` or `afterEach`.
- Prefer `getByRole`, `getByLabelText`, and `getByText`.
- Use `getByTestId` only when the behavior cannot be observed through roles, labels, text, or visible state.
- Use jest-dom assertions for accessibility and user-visible states.

## Contracts

Test user behavior, not implementation details.

Cover:

- routes and background routes;
- product workflow transitions;
- form validation;
- loading, empty, error, and success states named by the spec;
- RTK Query/store side effects when they are user-visible or product-critical;
- manager use of public `@powercoach/ui` contracts.

Do not assert copied UI internals. If a test would need private UI markup or class names, return `Blocked` or let `manager-po` produce a DS intent.

## Result

Return:

```text
Test Ready
- Spec: <manager-workdir>/docs/specs/<Feature>.md
- Test: <manager-workdir>/<path>/<Feature>.test.tsx
- Contracts: <brief user-facing contracts covered>
- Addresses: <none or CR-*/QA-*/SQ-* IDs>
- Untestable findings:
  - <none or concise list>

Spec Revision Ticket
...
```

Do not include backticks in delivery artifacts.
