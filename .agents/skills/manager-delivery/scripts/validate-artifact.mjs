#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const ROLE_TYPES = {
  "manager-po": [
    "Product Questions",
    "Technical Question For manager-dev",
    "Feature Spec Ready",
    "Design System Intent Required",
    "Blocked"
  ],
  "manager-dev-advice": ["Technical Manager Advice", "Blocked"],
  "manager-tdd": ["Test Ready", "Blocked"],
  "manager-dev": ["Implementation Ready", "Blocked"],
  "manager-review": ["Review Go", "Review Ko", "Blocked"],
  "manager-qa": ["QA Go", "QA Ko", "Spec Questions", "Blocked"]
};

const SPEC_PATH = /^apps\/(manager-revamp|manager)\/docs\/specs\/.+\.md$/;
const MANAGER_PATH = /^apps\/(manager-revamp|manager)\/.+/;
const TEST_PATH = /^apps\/(manager-revamp|manager)\/.+\.test\.(ts|tsx)$/;
const TICKET_ID = /^SR-\d{3}$/;
const TICKET_TYPES = new Set([
  "Feature Spec Ready",
  "Test Ready",
  "Implementation Ready",
  "Review Go",
  "Review Ko",
  "QA Go",
  "QA Ko",
  "Spec Questions"
]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fieldValue(text, field) {
  return text.match(new RegExp(`^[\\t ]*-[\\t ]+${escapeRegExp(field)}:[\\t ]*(.+)$`, "m"))?.[1].trim();
}

function hasField(text, field) {
  return new RegExp(`^[\\t ]*-[\\t ]+${escapeRegExp(field)}:(?:[\\t ]*.*)?$`, "m").test(text);
}

function blockForHeader(text, header) {
  const matches = [...text.matchAll(new RegExp(`^${escapeRegExp(header)}[\\t ]*$`, "gm"))];
  if (matches.length !== 1) return { block: null, count: matches.length };
  return { block: text.slice(matches[0].index), count: matches.length };
}

function requireField(text, field, issues) {
  const value = fieldValue(text, field);
  if (!value) issues.push(`Missing field: ${field}`);
  return value;
}

function requireHeader(text, field, issues) {
  if (!hasField(text, field)) issues.push(`Missing field: ${field}`);
}

function validatePlain(value, field, issues) {
  if (value?.includes("`")) issues.push(`${field} must not use backticks`);
}

function validatePath(value, regex, field, issues) {
  validatePlain(value, field, issues);
  if (value && !regex.test(value)) issues.push(`Invalid ${field}: ${value}`);
}

function itemIds(text, prefix) {
  return [...text.matchAll(new RegExp(`^[\\t ]*-[\\t ]+(${prefix}-\\d{3})[\\t ]*$`, "gm"))].map((match) => match[1]);
}

function validateIds(text, prefix, issues) {
  const ids = itemIds(text, prefix);
  if (ids.length === 0) issues.push(`No ${prefix}-* item found`);
  if (new Set(ids).size !== ids.length) issues.push(`Duplicate ${prefix}-* identifier`);
}

function validateItemBlocks(text, prefix, fields, issues) {
  const markers = [...text.matchAll(new RegExp(`^[\\t ]*-[\\t ]+(${prefix}-\\d{3})[\\t ]*$`, "gm"))];
  for (const [index, marker] of markers.entries()) {
    const id = marker[1];
    const block = text.slice(marker.index, markers[index + 1]?.index ?? text.length);
    for (const field of fields) {
      if (!fieldValue(block, field)) issues.push(`${id} missing field: ${field}`);
    }
  }
}

function validateAddresses(value, field, issues) {
  validatePlain(value, field, issues);
  if (!value || value === "none") return;
  const ids = [...value.matchAll(/\b[A-Z]{2}-\d{3}\b/g)].map((match) => match[0]);
  if (ids.length === 0) issues.push(`${field} must be none or contain correction IDs`);
  for (const id of ids) {
    if (!/^(CR|QA|SQ)-\d{3}$/.test(id)) issues.push(`${field} must not contain ${id}`);
  }
}

function validateTicket(text, issues, { required, spec } = {}) {
  const { block, count } = blockForHeader(text, "Spec Revision Ticket");
  if (!required && count === 0) return;
  if (count !== 1) {
    issues.push("Artifact must contain exactly one Spec Revision Ticket");
    return;
  }

  const id = requireField(block, "ID", issues);
  validatePlain(id, "Spec Revision Ticket ID", issues);
  if (id && !TICKET_ID.test(id)) issues.push("Spec Revision Ticket ID must be SR-###");

  const ticketSpec = requireField(block, "Spec", issues);
  validatePath(ticketSpec, SPEC_PATH, "Spec Revision Ticket Spec", issues);
  if (spec && ticketSpec && spec !== ticketSpec) issues.push("Spec Revision Ticket Spec must match artifact Spec");

  const fromRevision = requireField(block, "From revision", issues);
  const toRevision = requireField(block, "To revision", issues);
  validatePlain(fromRevision, "From revision", issues);
  validatePlain(toRevision, "To revision", issues);
  if (fromRevision && fromRevision !== "none" && !/^[1-9]\d*$/.test(fromRevision)) {
    issues.push("From revision must be a positive integer or none");
  }
  if (toRevision && !/^[1-9]\d*$/.test(toRevision)) issues.push("To revision must be a positive integer");
  validatePlain(requireField(block, "Reason", issues), "Reason", issues);
  requireHeader(block, "Scope", issues);
  requireHeader(block, "Non-scope", issues);
}

export function validateArtifactText(text, { role } = {}) {
  const issues = [];
  const normalized = text.trim();
  const type = normalized.split(/\r?\n/, 1)[0]?.trim();
  const allowed = ROLE_TYPES[role];

  if (!allowed) issues.push(`Unknown role: ${role ?? "<missing>"}`);
  if (!type) issues.push("Artifact is empty");
  if (allowed && !allowed.includes(type)) issues.push(`Artifact type ${type || "<missing>"} is not allowed for ${role}`);
  if (normalized.includes("`")) issues.push("Artifact must not contain backticks");

  const spec = fieldValue(normalized, "Spec");
  validateTicket(normalized, issues, { required: TICKET_TYPES.has(type), spec });

  if (type === "Blocked") {
    for (const field of ["Role", "Target", "Reason", "Resume with"]) {
      validatePlain(requireField(normalized, field, issues), field, issues);
    }
  }

  if (type === "Product Questions") {
    validateIds(normalized, "PQ", issues);
    validateItemBlocks(normalized, "PQ", ["Context", "Question"], issues);
  }

  if (type === "Technical Question For manager-dev") {
    const id = requireField(normalized, "ID", issues);
    validatePlain(id, "ID", issues);
    if (id && !/^TQ-\d{3}$/.test(id)) issues.push("ID must be TQ-###");
    validatePath(requireField(normalized, "Spec", issues), SPEC_PATH, "Spec", issues);
    requireField(normalized, "Context", issues);
    requireHeader(normalized, "Questions", issues);
  }

  if (type === "Technical Manager Advice") {
    const respondsTo = requireField(normalized, "Responds to", issues);
    validatePlain(respondsTo, "Responds to", issues);
    if (respondsTo && !/^TQ-\d{3}$/.test(respondsTo)) issues.push("Responds to must be TQ-###");
    requireHeader(normalized, "Answers", issues);
    requireHeader(normalized, "Risks or open questions", issues);
  }

  if (type === "Feature Spec Ready") {
    validatePath(requireField(normalized, "Spec", issues), SPEC_PATH, "Spec", issues);
    const approval = requireField(normalized, "Approval", issues);
    validatePlain(approval, "Approval", issues);
    if (approval && approval !== "explicit PM/user go") issues.push("Approval must be explicit PM/user go");
    validateAddresses(requireField(normalized, "Addresses", issues), "Addresses", issues);
  }

  if (type === "Design System Intent Required") {
    for (const field of ["Feature", "Manager spec", "User need", "Missing UI capability", "Consumer scenario", "Proposed DS intent"]) {
      validatePlain(requireField(normalized, field, issues), field, issues);
    }
  }

  if (type === "Test Ready") {
    validatePath(requireField(normalized, "Spec", issues), SPEC_PATH, "Spec", issues);
    validatePath(requireField(normalized, "Test", issues), TEST_PATH, "Test", issues);
    validatePlain(requireField(normalized, "Contracts", issues), "Contracts", issues);
    validateAddresses(requireField(normalized, "Addresses", issues), "Addresses", issues);
    requireHeader(normalized, "Untestable findings", issues);
  }

  if (type === "Implementation Ready") {
    validatePath(requireField(normalized, "Spec", issues), SPEC_PATH, "Spec", issues);
    validatePath(requireField(normalized, "Test", issues), TEST_PATH, "Test", issues);
    validatePath(requireField(normalized, "Target", issues), MANAGER_PATH, "Target", issues);
    validateAddresses(requireField(normalized, "Addresses", issues), "Addresses", issues);
  }

  if (type === "Review Ko") {
    validatePath(requireField(normalized, "Spec", issues), SPEC_PATH, "Spec", issues);
    validatePath(requireField(normalized, "Target", issues), MANAGER_PATH, "Target", issues);
    validateIds(normalized, "CR", issues);
    validateItemBlocks(normalized, "CR", ["Owner", "File", "Rule", "Observed", "Required correction"], issues);
  }

  if (type === "Review Go") {
    validatePath(requireField(normalized, "Spec", issues), SPEC_PATH, "Spec", issues);
    validatePath(requireField(normalized, "Target", issues), MANAGER_PATH, "Target", issues);
  }

  if (type === "QA Ko") {
    validatePath(requireField(normalized, "Spec", issues), SPEC_PATH, "Spec", issues);
    validateIds(normalized, "QA", issues);
    validateItemBlocks(normalized, "QA", ["Contract", "Expected", "Observed", "Evidence", "Required correction"], issues);
  }

  if (type === "QA Go") {
    validatePath(requireField(normalized, "Spec", issues), SPEC_PATH, "Spec", issues);
  }

  if (type === "Spec Questions") {
    validateIds(normalized, "SQ", issues);
    validateItemBlocks(normalized, "SQ", ["Spec", "Context", "Question"], issues);
  }

  return { issues, type };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function runCli() {
  const roleIndex = process.argv.indexOf("--role");
  const role = roleIndex >= 0 ? process.argv[roleIndex + 1] : undefined;
  const file = process.argv.find((argument, index) => index > 1 && index !== roleIndex && index !== roleIndex + 1 && !argument.startsWith("--"));
  const text = file ? fs.readFileSync(file, "utf8") : await readStdin();
  const result = validateArtifactText(text, { role });

  if (result.issues.length > 0) {
    for (const issue of result.issues) console.error(issue);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCli().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
