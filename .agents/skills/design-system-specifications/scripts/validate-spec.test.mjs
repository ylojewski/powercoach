import assert from "node:assert/strict";
import test from "node:test";

import { validateSpecText } from "./validate-spec.mjs";

const VALID_SPEC = `---
revision: 1
date: 2026-07-02
---

# Example

## Overview

## Anatomy

## Examples

### EX-001 - Example

Context: A consumer renders the example.

Expected behavior: The documented behavior is visible.

Covers: UC-001

\`\`\`tsx
import { Button } from '@powercoach/ui'
\`\`\`

## Use Cases

### UC-001 - Behavior

Given a consumer
When it renders
Then it works
`;

test("accepts mapped contracts and an exported package entry", () => {
  const result = validateSpecText(VALID_SPEC, {
    packageExports: { ".": { import: "./dist/index.js" } }
  });

  assert.deepEqual(result.issues, []);
  assert.deepEqual(result.examples, ["EX-001"]);
  assert.equal(result.revision, "1");
  assert.equal(result.date, "2026-07-02");
  assert.deepEqual(result.useCases, ["UC-001"]);
});

test("rejects unmapped use cases and unavailable package subpaths", () => {
  const result = validateSpecText(
    VALID_SPEC.replace("Covers: UC-001", "Covers: UC-999").replace(
      "@powercoach/ui",
      "@powercoach/ui/button"
    ),
    { packageExports: { ".": { import: "./dist/index.js" } } }
  );

  assert.ok(result.issues.includes("EX-001 covers unknown UC-999"));
  assert.ok(result.issues.includes("UC-001 is not covered by an example"));
  assert.ok(result.issues.includes("Package does not export @powercoach/ui/button"));
});

test("rejects malformed names, identifiers, examples, and use cases", () => {
  const result = validateSpecText(`# bad-name

## Anatomy

## Overview

## Examples

### EX-1 - Example

Covers: UC-1

## Use Cases

### UC-1 - Behavior

Given
When
Then
`);

  assert.ok(result.issues.includes("Spec must start with revision/date frontmatter"));
  assert.ok(result.issues.includes("Spec title must be a PascalCase public name"));
  assert.ok(result.issues.includes("Required sections are out of order"));
  assert.ok(result.issues.includes("EX-* identifiers must use three digits"));
  assert.ok(result.issues.includes("UC-* identifiers must use three digits"));
  assert.ok(result.issues.includes("EX-1 has no Context: value"));
  assert.ok(result.issues.includes("EX-1 has no Expected behavior: value"));
  assert.ok(result.issues.includes("UC-1 has no Given step"));
  assert.ok(result.issues.includes("UC-1 has no When step"));
  assert.ok(result.issues.includes("UC-1 has no Then step"));
});

test("rejects malformed revision metadata", () => {
  const result = validateSpecText(VALID_SPEC.replace(
    "revision: 1\ndate: 2026-07-02",
    "revision: zero\ndate: 02-07-2026\nstatus: draft"
  ));

  assert.ok(result.issues.includes("Spec frontmatter must contain only revision and date"));
  assert.ok(result.issues.includes("Spec revision must be a positive integer"));
  assert.ok(result.issues.includes("Spec date must use YYYY-MM-DD"));
});

test("checks filename identity and reusable animation naming", () => {
  const result = validateSpecText(VALID_SPEC, {
    expectedName: "RevealAnimation",
    kind: "animations",
    packageExports: { ".": { import: "./dist/index.js" } }
  });

  assert.ok(result.issues.includes("Spec title must match filename: RevealAnimation"));
  assert.ok(result.issues.includes("Reusable animation name must end with Animation"));
});

test("rejects single-part component specs that expose Root", () => {
  const result = validateSpecText(
    VALID_SPEC.replace(
      "## Use Cases",
      "## Root\n\n### Props\n\n## Use Cases"
    ).replace(
      "import { Button } from '@powercoach/ui'",
      "import { Example } from '@powercoach/ui'\n\n<Example.Root />"
    ),
    {
      kind: "components",
      packageExports: { ".": { import: "./dist/index.js" } }
    }
  );

  assert.ok(
    result.issues.includes("Single-part component specs must use the component name, not Root")
  );
});
