import assert from "node:assert/strict";
import test from "node:test";

import { validateArtifactBatchText, validateArtifactText } from "./validate-artifact.mjs";

const REVISION_TICKET = `Spec Revision Ticket
- ID: SR-002
- Spec: packages/ui/docs/design-system/components/Button.md
- From revision: 1
- To revision: 2
- Reason: Button is a single-part component and exposes Button directly.
- Scope:
  - Expose the public Button API as Button instead of Button.Root. Spec changes: lines 20-44.
- Non-scope:
  - Do not change unrelated Button behavior.
`;

test("accepts a complete correction Test Ready artifact", () => {
  const result = validateArtifactText(`Test Ready
- Spec: packages/ui/docs/design-system/components/Button.md
- Test: packages/ui/src/components/Button/Button.test.tsx
- Contracts: UC-001 and EX-001
- Addresses: QA-001
- Untestable findings: none

${REVISION_TICKET}
`, { role: "ds-tdd" });

  assert.deepEqual(result.issues, []);
  assert.equal(result.type, "Test Ready");
});

test("accepts an artifact carrying PM Visual Assets before the revision ticket", () => {
  const result = validateArtifactText(`Test Ready
- Spec: packages/ui/docs/design-system/components/Button.md
- Test: packages/ui/src/components/Button/Button.test.tsx
- Contracts: UC-001 and EX-001
- Addresses: QA-001
- Untestable findings: none

PM Visual Assets
- /Users/yann/Desktop/button-bug.mov
- /Users/yann/Desktop/button-reference.png

${REVISION_TICKET}
`, { role: "ds-tdd" });

  assert.deepEqual(result.issues, []);
  assert.equal(result.type, "Test Ready");
});

test("rejects an artifact type returned by the wrong role", () => {
  const result = validateArtifactText(`QA Go
- Spec: packages/ui/docs/design-system/components/Button.md
- Pass: initial
`, { role: "ds-review" });

  assert.ok(
    result.issues.includes("Artifact type QA Go is not allowed for ds-review")
  );
});

test("requires explicit PM approval on Specification Ready", () => {
  const result = validateArtifactText(`Specification Ready
- Spec: packages/ui/docs/design-system/components/Button.md
- Approval: inferred
- Addresses: none
`, { role: "ds-po" });

  assert.ok(result.issues.includes("Approval must be explicit PM/user go"));
});

test("rejects markdown formatting in artifact path fields", () => {
  const result = validateArtifactText(`Specification Ready
- Spec: \`packages/ui/docs/design-system/components/Button.md\`
- Approval: explicit PM/user go
- Addresses: none
`, { role: "ds-po" });

  assert.ok(result.issues.includes("Spec must not use backticks or markdown formatting"));
  assert.ok(result.issues.includes("Artifact must not contain backticks"));
});

test("rejects backticks anywhere in artifact prose", () => {
  const result = validateArtifactText(`Review Ko
- Spec: packages/ui/docs/design-system/components/Button.md
- Target: packages/ui/src/components/Button
- Pass: correction
- Findings:
  - CR-001
    - Owner: ds-tdd
    - File: packages/ui/src/components/Button/Button.test.tsx:10
    - Rule: public contract
    - Observed: copied \`Heading\` classes
    - Required correction: cover public composition
`, { role: "ds-review" });

  assert.ok(result.issues.includes("Artifact must not contain backticks"));
});

test("accepts QA-origin Specification Ready traceability", () => {
  const result = validateArtifactText(`Specification Ready
- Spec: packages/ui/docs/design-system/components/Button.md
- Approval: explicit PM/user go
- Addresses: SQ-001

${REVISION_TICKET}
`, { role: "ds-po" });

  assert.deepEqual(result.issues, []);
});

test("accepts animation test and target paths under src/animations", () => {
  const result = validateArtifactText(`Implementation Ready
- Spec: packages/ui/docs/design-system/animations/RevealAnimation.md
- Test: packages/ui/src/animations/RevealAnimation/RevealAnimation.test.tsx
- Target: packages/ui/src/animations/RevealAnimation
- Addresses: none

Spec Revision Ticket
- ID: SR-001
- Spec: packages/ui/docs/design-system/animations/RevealAnimation.md
- From revision: none
- To revision: 1
- Reason: Initial RevealAnimation specification.
- Scope:
  - Implement the initial RevealAnimation contract. Spec changes: lines 1-220.
- Non-scope:
  - None.
`, { role: "ds-dev" });

  assert.deepEqual(result.issues, []);
});

test("rejects artifacts after specification without a revision ticket", () => {
  const result = validateArtifactText(`Test Ready
- Spec: packages/ui/docs/design-system/components/Button.md
- Test: packages/ui/src/components/Button/Button.test.tsx
- Contracts: UC-001
- Addresses: none
- Untestable findings: none
`, { role: "ds-tdd" });

  assert.ok(result.issues.includes("Artifact must contain exactly one Spec Revision Ticket"));
});

test("rejects revision tickets whose ID and revision do not match", () => {
  const result = validateArtifactText(`Specification Ready
- Spec: packages/ui/docs/design-system/components/Button.md
- Approval: explicit PM/user go
- Addresses: none

Spec Revision Ticket
- ID: SR-003
- Spec: packages/ui/docs/design-system/components/Button.md
- From revision: 1
- To revision: 2
- Reason: Button API correction.
- Scope:
  - Expose Button directly. Spec changes: lines 20-44.
- Non-scope:
  - Leave unrelated behavior unchanged.
`, { role: "ds-po" });

  assert.ok(result.issues.includes("Spec Revision Ticket ID must match To revision"));
});

test("rejects revision ticket scope written as an authoring task", () => {
  const result = validateArtifactText(`Specification Ready
- Spec: packages/ui/docs/design-system/components/Button.md
- Approval: explicit PM/user go
- Addresses: none

Spec Revision Ticket
- ID: SR-002
- Spec: packages/ui/docs/design-system/components/Button.md
- From revision: 1
- To revision: 2
- Reason: Button API correction.
- Scope:
  - Document Button as a single-part component. Spec changes: lines 20-44.
- Non-scope:
  - Leave unrelated behavior unchanged.
`, { role: "ds-po" });

  assert.ok(
    result.issues.includes(
      "Spec Revision Ticket Scope item 1 must describe the public change, not an authoring task"
    )
  );
});

test("rejects revision ticket scope without per-item spec lines", () => {
  const result = validateArtifactText(`Specification Ready
- Spec: packages/ui/docs/design-system/components/Button.md
- Approval: explicit PM/user go
- Addresses: none

Spec Revision Ticket
- ID: SR-002
- Spec: packages/ui/docs/design-system/components/Button.md
- From revision: 1
- To revision: 2
- Reason: Button API correction.
- Scope:
  - Expose Button directly.
- Non-scope:
  - Leave unrelated behavior unchanged.
`, { role: "ds-po" });

  assert.ok(
    result.issues.includes(
      'Spec Revision Ticket Scope item 1 must end with "Spec changes: lines <line-range>."'
    )
  );
});

test("rejects revision ticket scope that repeats revision numbers", () => {
  const result = validateArtifactText(`Specification Ready
- Spec: packages/ui/docs/design-system/components/Button.md
- Approval: explicit PM/user go
- Addresses: none

Spec Revision Ticket
- ID: SR-002
- Spec: packages/ui/docs/design-system/components/Button.md
- From revision: 1
- To revision: 2
- Reason: Button API correction.
- Scope:
  - Expose Button directly. Spec changes from revision 1 to revision 2: lines 20-44.
- Non-scope:
  - Leave unrelated behavior unchanged.
`, { role: "ds-po" });

  assert.ok(
    result.issues.includes(
      'Spec Revision Ticket Scope item 1 must use "Spec changes: lines ..." without repeating revision numbers'
    )
  );
});

test("rejects SR identifiers in Addresses", () => {
  const result = validateArtifactText(`Implementation Ready
- Spec: packages/ui/docs/design-system/components/Button.md
- Test: packages/ui/src/components/Button/Button.test.tsx
- Target: packages/ui/src/components/Button
- Addresses: SR-002

${REVISION_TICKET}
`, { role: "ds-dev" });

  assert.ok(result.issues.includes("Addresses must not contain SR-002"));
});

test("rejects technical advice responding to several question IDs", () => {
  const result = validateArtifactText(`Technical Specification Advice
- Responds to: TQ-001, TQ-002
- Answers: combined answer
- Base UI references: none
- Risks or open questions: none
`, { role: "ds-dev-advice" });

  assert.ok(result.issues.includes("Responds to must be TQ-###"));
});

test("accepts technical questions from ds-po for ds-dev advice", () => {
  const result = validateArtifactText(`Technical Question For ds-dev
- ID: TQ-001
- Component or animation: Button
- Spec: packages/ui/docs/design-system/components/Button.md
- Context: Need public anatomy advice before spec approval.
- Questions:
  1. Which public parts are necessary?
`, { role: "ds-po" });

  assert.deepEqual(result.issues, []);
});

test("accepts multiple Product Questions separated by blank lines", () => {
  const result = validateArtifactText(`Product Questions
- PQ-001
  - Context: First unresolved product decision.
  - Question: What should the first behavior be?

- PQ-002
  - Context: Second unresolved product decision.
  - Question: What should the second behavior be?
`, { role: "ds-po" });

  assert.deepEqual(result.issues, []);
});

test("requires context for Spec Questions", () => {
  const result = validateArtifactText(`Spec Questions
- SQ-001
  - Spec: packages/ui/docs/design-system/components/Button.md
  - Question: Should keyboard focus receive a product treatment?
`, { role: "ds-qa" });

  assert.ok(result.issues.includes("SQ-001 missing field: Context"));
});

test("rejects malformed Review Ko owners, IDs, and fields", () => {
  const result = validateArtifactText(`Review Ko
- Spec: packages/ui/docs/design-system/components/Button.md
- Target: packages/ui/src/components/Button
- Pass: correction
- Findings:
  - CR-001
    - Owner: ds-po
    - File: packages/ui/src/components/Button/Button.tsx:10
    - Rule: public contract
    - Observed: mismatch
`, { role: "ds-review" });

  assert.ok(result.issues.includes("CR-001 missing field: Required correction"));
  assert.ok(result.issues.includes("Invalid Review Ko owner: ds-po"));
});

test("rejects duplicate stable QA finding IDs", () => {
  const finding = `  - QA-001
    - Contract: UC-001
    - Expected: expected
    - Observed: observed
    - Evidence: report.md
    - Required correction: correct it
`;
  const result = validateArtifactText(`QA Ko
- Spec: packages/ui/docs/design-system/components/Button.md
- Pass: correction
- Findings:
${finding}${finding}`, { role: "ds-qa" });

  assert.ok(result.issues.includes("Duplicate QA-* identifier"));
});

test("accepts linked batch implementation artifacts when tickets match", () => {
  const result = validateArtifactBatchText(`Implementation Ready
- Spec: packages/ui/docs/design-system/animations/RevealAnimation.md
- Test: packages/ui/src/animations/RevealAnimation/RevealAnimation.test.tsx
- Target: packages/ui/src/animations/RevealAnimation
- Addresses: none

Spec Revision Ticket
- ID: SR-002
- Spec: packages/ui/docs/design-system/animations/RevealAnimation.md
- From revision: 1
- To revision: 2
- Reason: Add inline mode.
- Scope:
  - Add inline mode. Spec changes: lines 80-120.
- Non-scope:
  - Leave unrelated behavior unchanged.

Implementation Ready
- Spec: packages/ui/docs/design-system/components/Button.md
- Test: packages/ui/src/components/Button/Button.test.tsx
- Target: packages/ui/src/components/Button
- Addresses: none

Spec Revision Ticket
- ID: SR-004
- Spec: packages/ui/docs/design-system/components/Button.md
- From revision: 3
- To revision: 4
- Reason: Compose inline reveal mode.
- Scope:
  - Compose inline reveal mode. Spec changes: lines 130-155.
- Non-scope:
  - Leave unrelated behavior unchanged.
`, {
    expectedTickets: ["SR-002", "SR-004"],
    role: "ds-dev"
  });

  assert.deepEqual(result.issues, []);
  assert.equal(result.type, "Artifact Batch");
});

test("accepts linked batch specification artifacts from ds-po with repeated raw SR IDs", () => {
  const result = validateArtifactBatchText(`Specification Ready
- Spec: packages/ui/docs/design-system/components/Autocomplete.md
- Approval: explicit PM/user go
- Addresses: none

Spec Revision Ticket
- ID: SR-001
- Spec: packages/ui/docs/design-system/components/Autocomplete.md
- From revision: none
- To revision: 1
- Reason: Initial Autocomplete specification.
- Scope:
  - Define the initial Autocomplete public contract. Spec changes: lines 1-220.
- Non-scope:
  - Leave unrelated component contracts unchanged.

Specification Ready
- Spec: packages/ui/docs/design-system/components/Input.md
- Approval: explicit PM/user go
- Addresses: none

Spec Revision Ticket
- ID: SR-002
- Spec: packages/ui/docs/design-system/components/Input.md
- From revision: 1
- To revision: 2
- Reason: Add Autocomplete integration support.
- Scope:
  - Expose the Input contract required by Autocomplete. Spec changes: lines 80-120.
- Non-scope:
  - Leave unrelated Input behavior unchanged.

Specification Ready
- Spec: packages/ui/docs/design-system/components/BottomSheet.md
- Approval: explicit PM/user go
- Addresses: none

Spec Revision Ticket
- ID: SR-002
- Spec: packages/ui/docs/design-system/components/BottomSheet.md
- From revision: 1
- To revision: 2
- Reason: Add Autocomplete mobile presentation support.
- Scope:
  - Expose the BottomSheet contract required by Autocomplete. Spec changes: lines 140-168.
- Non-scope:
  - Leave unrelated BottomSheet behavior unchanged.
`, {
    expectedTickets: [
      "packages/ui/docs/design-system/components/Autocomplete.md#SR-001",
      "packages/ui/docs/design-system/components/Input.md#SR-002",
      "packages/ui/docs/design-system/components/BottomSheet.md#SR-002"
    ],
    role: "ds-po"
  });

  assert.deepEqual(result.issues, []);
  assert.equal(result.type, "Artifact Batch");
  assert.deepEqual(result.artifacts.map((artifact) => artifact.ticketIdentity), [
    "packages/ui/docs/design-system/components/Autocomplete.md#SR-001",
    "packages/ui/docs/design-system/components/Input.md#SR-002",
    "packages/ui/docs/design-system/components/BottomSheet.md#SR-002"
  ]);
});

test("rejects linked batch artifacts with the same spec and SR identity twice", () => {
  const result = validateArtifactBatchText(`Specification Ready
- Spec: packages/ui/docs/design-system/components/Button.md
- Approval: explicit PM/user go
- Addresses: none

Spec Revision Ticket
- ID: SR-002
- Spec: packages/ui/docs/design-system/components/Button.md
- From revision: 1
- To revision: 2
- Reason: Button API correction.
- Scope:
  - Expose Button directly. Spec changes: lines 20-44.
- Non-scope:
  - Leave unrelated behavior unchanged.

Specification Ready
- Spec: packages/ui/docs/design-system/components/Button.md
- Approval: explicit PM/user go
- Addresses: none

Spec Revision Ticket
- ID: SR-002
- Spec: packages/ui/docs/design-system/components/Button.md
- From revision: 1
- To revision: 2
- Reason: Button API correction.
- Scope:
  - Expose Button directly. Spec changes: lines 20-44.
- Non-scope:
  - Leave unrelated behavior unchanged.
`, {
    expectedTickets: [
      "packages/ui/docs/design-system/components/Button.md#SR-002",
      "packages/ui/docs/design-system/components/Button.md#SR-002"
    ],
    role: "ds-po"
  });

  assert.ok(
    result.issues.includes(
      "Linked batch artifacts must not duplicate Spec Revision Ticket identities"
    )
  );
});

test("rejects linked batch artifacts that do not cover expected tickets", () => {
  const result = validateArtifactBatchText(`Implementation Ready
- Spec: packages/ui/docs/design-system/animations/RevealAnimation.md
- Test: packages/ui/src/animations/RevealAnimation/RevealAnimation.test.tsx
- Target: packages/ui/src/animations/RevealAnimation
- Addresses: none

Spec Revision Ticket
- ID: SR-002
- Spec: packages/ui/docs/design-system/animations/RevealAnimation.md
- From revision: 1
- To revision: 2
- Reason: Add inline mode.
- Scope:
  - Add inline mode. Spec changes: lines 80-120.
- Non-scope:
  - Leave unrelated behavior unchanged.
`, {
    expectedTickets: ["SR-002", "SR-004"],
    role: "ds-dev"
  });

  assert.ok(
    result.issues.includes("Artifact tickets must exactly match expected linked SR batch tickets")
  );
});
