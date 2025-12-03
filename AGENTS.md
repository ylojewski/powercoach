# AGENTS.md — Powercoach Agent Guidelines

This file defines the minimal rules that apply to every task in the Powercoach monorepo.

---

## 1. Repository Context

- The repository is a pnpm + Turborepo monorepo.
- Node version is defined in the root package.json under "engines".
- Applications:
  - apps/api
  - apps/manager
- Shared packages:
  - packages/\*
- Language is English only

All changes MUST respect this structure and avoid breaking other apps/packages.

---

## 2. Task Bootstrap

Always start by installing the dependencies with:

```bash
pnpm install --frozen-lockfile
```

Do not modify the lockfile unless explicitly requested.

---

## 3. Coding Style and Conventions

### Follow the existing style

All contributions MUST follow the existing coding style and conventions already used across the repository:

- Reuse existing patterns and established architectural conventions.
- Keep consistent naming, file structure and folder organization.
- Do not introduce new paradigms, tools or patterns unless explicitly required.

### Tooling rules

- ESLint and Prettier configurations act as the single source of truth for formatting and linting.
- TypeScript configurations and project references must be respected.
- Tests use Vitest, and contributors should match the existing test structure.

When unsure, replicate an existing pattern from a similar part of the monorepo.

---

## 4. Root Tasks Before Commit

Before committing (locally or in a PR), the following root-level pnpm scripts that do NOT start with deploy: MUST succeed.
Mandatory tasks are (in that order):

```bash
pnpm pre-commit
```

Scripts prefixed with deploy: are explicitly excluded.

---

## 5. Commit messages and branch names

- MUST always follow conventional commit.
- MUST use imperative form (e.g. add, update, fix).
- The subject MUST be defined and one word descriptive.
- Branch names MUST match the first commit message slug and MUST be of the form

`verb/subject/topic`

```bash
feat(manager): add session timeout handling
feat/manager/add-session-timeout-handling
```

- If one task targets multiple apps and or packages, **use \* as subject**

Examples:

```bash
feat(manager): add session timeout handling
fix(api): sanitize nullable user id
chore(powercoach): update linter configuration
```

### Commit message body

CI / CD checks for commit message content. These checks include:

- The presence of the issue number
- The presence of the branch name
- The number of commits in the branch, exactly ONE

Examples:

```bash
feat(manager): add session timeout handling

Closes #42
From feat/manager/add-session-timeout-handling
```

**If the issue number is not specified in the prompt, do not start the task and ask for it**

---

End — these guidelines apply to all tasks and agents working within the Powercoach monorepo.
