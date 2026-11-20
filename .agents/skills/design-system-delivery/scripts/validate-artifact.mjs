#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROLE_TYPES = {
  "ds-po": [
    "Product Questions",
    "Technical Question For ds-dev",
    "Specification Ready",
    "Blocked"
  ],
  "ds-dev-advice": ["Technical Specification Advice", "Blocked"],
  "ds-tdd": ["Test Ready", "Blocked"],
  "ds-dev": ["Implementation Ready", "Blocked"],
  "ds-review": ["Review Go", "Review Ko", "Blocked"],
  "ds-qa": ["QA Go", "QA Ko", "Spec Questions", "Blocked"]
};

const ARTIFACT_TYPES = [...new Set(Object.values(ROLE_TYPES).flat())].sort(
  (a, b) => b.length - a.length
);
const BATCH_RESULT_ROLES = new Set([
  "ds-po",
  "ds-tdd",
  "ds-dev",
  "ds-review",
  "ds-qa"
]);

const SPEC_PATH =
  /^packages\/ui\/docs\/design-system\/(components|animations)\/[A-Z][A-Za-z0-9]*\.md$/;
const TICKET_ID = /^SR-\d{3}$/;
const TICKET_REFERENCE =
  /^packages\/ui\/docs\/design-system\/(components|animations)\/[A-Z][A-Za-z0-9]*\.md#SR-\d{3}$/;
const TEST_PATH =
  /^packages\/ui\/src\/(components|animations)\/.+\/[A-Z][A-Za-z0-9]*\.test\.tsx$/;
const TARGET_PATH =
  /^packages\/ui\/src\/(components|animations)\/[A-Za-z0-9/]+$/;
const REVISION_TICKET_TYPES = new Set([
  "Specification Ready",
  "Test Ready",
  "Implementation Ready",
  "Review Ko",
  "Review Go",
  "QA Ko",
  "QA Go",
  "Spec Questions"
]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fieldValue(text, field) {
  return text.match(
    new RegExp(`^[\\t ]*-[\\t ]+${escapeRegExp(field)}:[\\t ]*(.+)$`, "m")
  )?.[1].trim();
}

function hasField(text, field) {
  return new RegExp(
    `^[\\t ]*-[\\t ]+${escapeRegExp(field)}:(?:[\\t ]*.*)?$`,
    "m"
  ).test(text);
}

function blockForHeader(text, header) {
  const matches = [...text.matchAll(
    new RegExp(`^${escapeRegExp(header)}[\\t ]*$`, "gm")
  )];

  if (matches.length !== 1) return { block: null, count: matches.length };

  return {
    block: text.slice(matches[0].index),
    count: matches.length
  };
}

function splitArtifactText(text) {
  const normalized = text.trim();
  if (!normalized) return [];

  const headers = [...normalized.matchAll(
    new RegExp(
      `^(${ARTIFACT_TYPES.map(escapeRegExp).join("|")})[\\t ]*$`,
      "gm"
    )
  )];

  if (headers.length <= 1) return [normalized];

  return headers.map((header, index) =>
    normalized.slice(
      header.index,
      headers[index + 1]?.index ?? normalized.length
    ).trim()
  );
}

function requireField(text, field, issues) {
  const value = fieldValue(text, field);
  if (!value) issues.push(`Missing field: ${field}`);
  return value;
}

function validatePlainField(value, field, issues) {
  if (value?.includes("`")) {
    issues.push(`${field} must not use backticks or markdown formatting`);
  }
}

function requireFieldHeader(text, field, issues) {
  if (!hasField(text, field)) issues.push(`Missing field: ${field}`);
}

function listFieldItems(text, field) {
  const lines = text.split(/\r?\n/);
  const startIndex = lines.findIndex((line) =>
    new RegExp(`^[\\t ]*-[\\t ]+${escapeRegExp(field)}:[\\t ]*$`).test(line)
  );

  if (startIndex < 0) return [];

  const items = [];
  for (const line of lines.slice(startIndex + 1)) {
    if (/^-[\t ]+[A-Z][^:\n]*:/.test(line)) break;

    const match = line.match(/^[\t ]{2,}-[\t ]+(.+)$/);
    if (match) items.push(match[1].trim());
  }

  return items;
}

function unique(values) {
  return new Set(values).size === values.length;
}

function sameMultiset(left, right) {
  if (left.length !== right.length) return false;

  const counts = new Map();
  for (const value of left) counts.set(value, (counts.get(value) ?? 0) + 1);

  for (const value of right) {
    const count = counts.get(value);
    if (!count) return false;
    if (count === 1) counts.delete(value);
    else counts.set(value, count - 1);
  }

  return counts.size === 0;
}

function itemIds(text, prefix) {
  return [...text.matchAll(
    new RegExp(`^[\\t ]*-[\\t ]+(${prefix}-\\d{3})[\\t ]*$`, "gm")
  )].map((match) => match[1]);
}

function validateIds(text, prefix, issues) {
  const ids = itemIds(text, prefix);
  if (ids.length === 0) issues.push(`No ${prefix}-* item found`);
  if (!unique(ids)) issues.push(`Duplicate ${prefix}-* identifier`);
  return ids;
}

function validateItemBlocks(text, prefix, fields, issues) {
  const markers = [...text.matchAll(
    new RegExp(`^[\\t ]*-[\\t ]+(${prefix}-\\d{3})[\\t ]*$`, "gm")
  )];

  for (const [index, marker] of markers.entries()) {
    const id = marker[1];
    const block = text.slice(
      marker.index,
      markers[index + 1]?.index ?? text.length
    );
    for (const field of fields) {
      if (!fieldValue(block, field)) issues.push(`${id} missing field: ${field}`);
    }
  }
}

function validateSpecPath(value, field, issues) {
  validatePlainField(value, field, issues);
  if (value && !SPEC_PATH.test(value)) {
    issues.push(`${field} must be a Powercoach UI spec path`);
  }
}

function validateTestPath(value, field, issues) {
  validatePlainField(value, field, issues);
  if (value && !TEST_PATH.test(value)) {
    issues.push(
      `${field} must be a public Powercoach UI component or animation .test.tsx path`
    );
  }
}

function validateTargetPath(value, field, issues) {
  validatePlainField(value, field, issues);
  if (value && !TARGET_PATH.test(value)) {
    issues.push(
      `${field} must be a Powercoach UI component or animation family path`
    );
  }
}

function validatePass(value, issues) {
  validatePlainField(value, "Pass", issues);
  if (value && !["initial", "correction"].includes(value)) {
    issues.push("Pass must be initial or correction");
  }
}

function validateRevisionValue(value, field, issues, { allowNone = false } = {}) {
  validatePlainField(value, field, issues);
  if (allowNone && value === "none") return;
  if (value && !/^[1-9]\d*$/.test(value)) {
    issues.push(`${field} must be a positive integer${allowNone ? " or none" : ""}`);
  }
}

function validateRevisionTicketScope(text, issues) {
  const items = listFieldItems(text, "Scope");
  if (items.length === 0) {
    issues.push("Spec Revision Ticket Scope must contain at least one bullet");
    return;
  }

  for (const [index, item] of items.entries()) {
    const field = `Spec Revision Ticket Scope item ${index + 1}`;
    validatePlainField(item, field, issues);

    if (/^(Document|Update|Describe|Mention|Write|Revise)\b/i.test(item)) {
      issues.push(`${field} must describe the public change, not an authoring task`);
    }

    if (/\bSpec(?:ification)? changes from revision\b/i.test(item)) {
      issues.push(`${field} must use "Spec changes: lines ..." without repeating revision numbers`);
    }

    if (!/\bSpec changes: lines \d+(?:-\d+)?(?:, \d+(?:-\d+)?)*\.$/.test(item)) {
      issues.push(`${field} must end with "Spec changes: lines <line-range>."`);
    }
  }
}

function validateRevisionTicket(text, issues, { required, spec } = {}) {
  const { block, count } = blockForHeader(text, "Spec Revision Ticket");

  if (!required && count === 0) return;
  if (count !== 1) {
    issues.push("Artifact must contain exactly one Spec Revision Ticket");
    return;
  }

  const id = requireField(block, "ID", issues);
  validatePlainField(id, "ID", issues);
  if (id && !TICKET_ID.test(id)) issues.push("Spec Revision Ticket ID must be SR-###");

  const ticketSpec = requireField(block, "Spec", issues);
  validateSpecPath(ticketSpec, "Spec Revision Ticket Spec", issues);
  if (spec && ticketSpec && spec !== ticketSpec) {
    issues.push("Spec Revision Ticket Spec must match artifact Spec");
  }

  const fromRevision = requireField(block, "From revision", issues);
  const toRevision = requireField(block, "To revision", issues);
  validateRevisionValue(fromRevision, "From revision", issues, { allowNone: true });
  validateRevisionValue(toRevision, "To revision", issues);

  const fromNumber = fromRevision === "none" ? null : Number(fromRevision);
  const toNumber = Number(toRevision);
  const idNumber = id && TICKET_ID.test(id) ? Number(id.slice(3)) : null;

  if (idNumber && toNumber && idNumber !== toNumber) {
    issues.push("Spec Revision Ticket ID must match To revision");
  }
  if (fromRevision === "none" && toNumber !== 1) {
    issues.push("New specs must use From revision none and To revision 1");
  }
  if (fromNumber && toNumber && toNumber !== fromNumber + 1) {
    issues.push("To revision must be exactly From revision + 1");
  }

  validatePlainField(requireField(block, "Reason", issues), "Reason", issues);
  requireFieldHeader(block, "Scope", issues);
  validateRevisionTicketScope(block, issues);
  requireFieldHeader(block, "Non-scope", issues);
}

function revisionTicketRef(text) {
  const { block, count } = blockForHeader(text, "Spec Revision Ticket");
  if (count !== 1) return null;

  const id = fieldValue(block, "ID");
  const spec = fieldValue(block, "Spec");

  if (!id || !spec) return null;

  return {
    id,
    identity: `${spec}#${id}`,
    spec
  };
}

function normalizeExpectedTickets(value) {
  if (!value) return [];

  return value
    .split(",")
    .map((ticket) => ticket.trim())
    .filter(Boolean);
}

function expectedTicketIssues(expectedTickets) {
  const issues = [];
  const hasIds = expectedTickets.some((ticket) => TICKET_ID.test(ticket));
  const hasReferences = expectedTickets.some((ticket) => TICKET_REFERENCE.test(ticket));

  for (const ticket of expectedTickets) {
    if (!TICKET_ID.test(ticket) && !TICKET_REFERENCE.test(ticket)) {
      issues.push(
        `Expected ticket must be SR-### or packages/ui/docs/design-system/<kind>/<Name>.md#SR-###: ${ticket}`
      );
    }
  }

  if (hasIds && hasReferences) {
    issues.push("Expected linked SR batch tickets must not mix raw IDs and spec-qualified references");
  }

  return issues;
}

function ticketKeysForExpected(ticketRefs, expectedTickets) {
  const useIdentity = expectedTickets.some((ticket) => TICKET_REFERENCE.test(ticket));
  return ticketRefs.map((ticketRef) => useIdentity ? ticketRef.identity : ticketRef.id);
}

function validateAddresses(value, field, issues) {
  validatePlainField(value, field, issues);
  if (!value || value === "none") return;

  const ids = [...value.matchAll(/\b[A-Z]{2}-\d{3}\b/g)].map((match) => match[0]);
  if (ids.length === 0) {
    issues.push(`${field} must be none or contain correction IDs`);
    return;
  }
  for (const id of ids) {
    if (!/^(CR|QA|SQ)-\d{3}$/.test(id)) {
      issues.push(`${field} must not contain ${id}`);
    }
  }
}

export function validateArtifactText(text, { role } = {}) {
  const issues = [];
  const normalized = text.trim();
  const type = normalized.split(/\r?\n/, 1)[0]?.trim();
  const allowed = ROLE_TYPES[role];

  if (!allowed) issues.push(`Unknown role: ${role ?? "<missing>"}`);
  if (!type) issues.push("Artifact is empty");
  if (allowed && !allowed.includes(type)) {
    issues.push(`Artifact type ${type || "<missing>"} is not allowed for ${role}`);
  }

  if (issues.length > 0 && !type) return { issues, type: null };

  if (normalized.includes("`")) {
    issues.push("Artifact must not contain backticks");
  }

  const mainSpec = fieldValue(normalized, "Spec");
  validateRevisionTicket(normalized, issues, {
    required: REVISION_TICKET_TYPES.has(type),
    spec: mainSpec
  });

  if (type === "Blocked") {
    for (const field of ["Role", "Target", "Reason", "Resume with"]) {
      validatePlainField(requireField(normalized, field, issues), field, issues);
    }
  }

  if (type === "Product Questions") {
    validateIds(normalized, "PQ", issues);
    validateItemBlocks(normalized, "PQ", ["Context", "Question"], issues);
  }

  if (type === "Technical Question For ds-dev") {
    const id = requireField(normalized, "ID", issues);
    validatePlainField(id, "ID", issues);
    if (id && !/^TQ-\d{3}$/.test(id)) issues.push("ID must be TQ-###");
    validatePlainField(
      requireField(normalized, "Component or animation", issues),
      "Component or animation",
      issues
    );
    validateSpecPath(requireField(normalized, "Spec", issues), "Spec", issues);
    requireField(normalized, "Context", issues);
    if (!/^- Questions:\s*$/m.test(normalized)) {
      issues.push("Missing field: Questions");
    }
  }

  if (type === "Technical Specification Advice") {
    const respondsTo = requireField(normalized, "Responds to", issues);
    validatePlainField(respondsTo, "Responds to", issues);
    if (respondsTo && !/^TQ-\d{3}$/.test(respondsTo)) {
      issues.push("Responds to must be TQ-###");
    }
    for (const field of [
      "Answers",
      "Base UI references",
      "Risks or open questions"
    ]) {
      requireFieldHeader(normalized, field, issues);
    }
  }

  if (type === "Specification Ready") {
    validateSpecPath(requireField(normalized, "Spec", issues), "Spec", issues);
    const approval = requireField(normalized, "Approval", issues);
    validatePlainField(approval, "Approval", issues);
    if (approval && approval !== "explicit PM/user go") {
      issues.push("Approval must be explicit PM/user go");
    }
    validateAddresses(requireField(normalized, "Addresses", issues), "Addresses", issues);
  }

  if (type === "Test Ready") {
    validateSpecPath(requireField(normalized, "Spec", issues), "Spec", issues);
    validateTestPath(requireField(normalized, "Test", issues), "Test", issues);
    validatePlainField(requireField(normalized, "Contracts", issues), "Contracts", issues);
    validateAddresses(requireField(normalized, "Addresses", issues), "Addresses", issues);
    requireFieldHeader(normalized, "Untestable findings", issues);
  }

  if (type === "Implementation Ready") {
    validateSpecPath(requireField(normalized, "Spec", issues), "Spec", issues);
    validateTestPath(requireField(normalized, "Test", issues), "Test", issues);
    validateTargetPath(requireField(normalized, "Target", issues), "Target", issues);
    validateAddresses(requireField(normalized, "Addresses", issues), "Addresses", issues);
  }

  if (type === "Review Ko") {
    validateSpecPath(requireField(normalized, "Spec", issues), "Spec", issues);
    validateTargetPath(requireField(normalized, "Target", issues), "Target", issues);
    validatePass(requireField(normalized, "Pass", issues), issues);
    validateIds(normalized, "CR", issues);
    validateItemBlocks(
      normalized,
      "CR",
      ["Owner", "File", "Rule", "Observed", "Required correction"],
      issues
    );
    for (const owner of [...normalized.matchAll(/^\s*-\s+Owner:\s*(.+)$/gm)]) {
      validatePlainField(owner[1].trim(), "Owner", issues);
      if (!["ds-tdd", "ds-dev"].includes(owner[1].trim())) {
        issues.push(`Invalid Review Ko owner: ${owner[1].trim()}`);
      }
    }
    for (const file of [...normalized.matchAll(/^\s*-\s+File:\s*(.+)$/gm)]) {
      validatePlainField(file[1].trim(), "File", issues);
      if (!/^packages\/ui\/.+:\d+$/.test(file[1].trim())) {
        issues.push(`Invalid Review Ko file location: ${file[1].trim()}`);
      }
    }
  }

  if (type === "Review Go") {
    validateSpecPath(requireField(normalized, "Spec", issues), "Spec", issues);
    validateTargetPath(requireField(normalized, "Target", issues), "Target", issues);
    validatePass(requireField(normalized, "Pass", issues), issues);
  }

  if (type === "QA Ko") {
    validateSpecPath(requireField(normalized, "Spec", issues), "Spec", issues);
    validatePass(requireField(normalized, "Pass", issues), issues);
    validateIds(normalized, "QA", issues);
    validateItemBlocks(
      normalized,
      "QA",
      ["Contract", "Expected", "Observed", "Evidence", "Required correction"],
      issues
    );
  }

  if (type === "QA Go") {
    validateSpecPath(requireField(normalized, "Spec", issues), "Spec", issues);
    validatePass(requireField(normalized, "Pass", issues), issues);
  }

  if (type === "Spec Questions") {
    validateIds(normalized, "SQ", issues);
    validateItemBlocks(
      normalized,
      "SQ",
      ["Spec", "Context", "Question"],
      issues
    );
    for (const match of normalized.matchAll(/^\s*-\s+Spec:\s*(.+)$/gm)) {
      validateSpecPath(match[1].trim(), "Spec", issues);
    }
  }

  return { issues, type };
}

export function validateArtifactBatchText(text, { role, expectedTickets = [] } = {}) {
  const artifacts = splitArtifactText(text);
  const normalized = text.trim();

  if (artifacts.length <= 1) {
    const result = validateArtifactText(artifacts[0] ?? "", { role });
    const ticketRefs = [revisionTicketRef(artifacts[0] ?? "")].filter(Boolean);
    const issues = [...result.issues, ...expectedTicketIssues(expectedTickets)];
    const ticketKeys = ticketKeysForExpected(ticketRefs, expectedTickets);

    if (expectedTickets.length > 0 && !sameMultiset(ticketKeys, expectedTickets)) {
      issues.push("Artifact tickets must exactly match expected linked SR batch tickets");
    }

    return {
      artifacts: [{
        text: artifacts[0] ?? "",
        ticketId: ticketRefs[0]?.id ?? null,
        ticketIdentity: ticketRefs[0]?.identity ?? null,
        type: result.type
      }],
      issues,
      type: result.type
    };
  }

  const issues = [...expectedTicketIssues(expectedTickets)];
  const firstHeader = normalized.match(
    new RegExp(
      `^(${ARTIFACT_TYPES.map(escapeRegExp).join("|")})[\\t ]*$`,
      "m"
    )
  );
  const prelude = firstHeader?.index ? normalized.slice(0, firstHeader.index).trim() : "";
  if (prelude) {
    issues.push("Linked batch response must start with the first result artifact");
  }

  const results = artifacts.map((artifact) => validateArtifactText(artifact, { role }));

  if (!BATCH_RESULT_ROLES.has(role)) {
    issues.push(`Role ${role ?? "<missing>"} does not accept linked batch responses`);
  }

  for (const [index, result] of results.entries()) {
    for (const issue of result.issues) {
      issues.push(`Artifact ${index + 1}: ${issue}`);
    }
    if (result.type === "Blocked") {
      issues.push("Blocked must be returned alone, not inside a linked batch response");
    }
  }

  const ticketRefs = artifacts.map(revisionTicketRef).filter(Boolean);
  const ticketIdentities = ticketRefs.map((ticketRef) => ticketRef.identity);
  if (ticketRefs.length !== artifacts.length) {
    issues.push("Every linked batch artifact must contain one Spec Revision Ticket");
  }
  if (!unique(ticketIdentities)) {
    issues.push("Linked batch artifacts must not duplicate Spec Revision Ticket identities");
  }
  if (
    expectedTickets.length > 0
    && !sameMultiset(ticketKeysForExpected(ticketRefs, expectedTickets), expectedTickets)
  ) {
    issues.push("Artifact tickets must exactly match expected linked SR batch tickets");
  }

  return {
    artifacts: artifacts.map((artifact, index) => ({
      text: artifact,
      ticketId: revisionTicketRef(artifact)?.id ?? null,
      ticketIdentity: revisionTicketRef(artifact)?.identity ?? null,
      type: results[index]?.type ?? null
    })),
    issues,
    type: "Artifact Batch"
  };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function runCli() {
  const roleIndex = process.argv.indexOf("--role");
  const role = roleIndex >= 0 ? process.argv[roleIndex + 1] : undefined;
  const ticketsIndex = process.argv.indexOf("--tickets");
  const expectedTickets = normalizeExpectedTickets(
    ticketsIndex >= 0 ? process.argv[ticketsIndex + 1] : ""
  );
  const file = process.argv.find(
    (argument, index) =>
      index > 1
      && index !== roleIndex
      && index !== roleIndex + 1
      && index !== ticketsIndex
      && index !== ticketsIndex + 1
      && !argument.startsWith("--")
  );
  const text = file ? fs.readFileSync(file, "utf8") : await readStdin();
  const result = validateArtifactBatchText(text, { role, expectedTickets });

  if (result.issues.length > 0) {
    console.error("Artifact Validation: blocked");
    for (const issue of result.issues) console.error(`- ${issue}`);
    process.exitCode = 1;
    return;
  }

  console.log("Artifact Validation: go");
  console.log(`- Role: ${role}`);
  console.log(`- Type: ${result.type}`);
  if (result.artifacts.length > 1) {
    console.log(`- Artifacts: ${result.artifacts.length}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await runCli();
